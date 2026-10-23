import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve, sep } from 'node:path';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const UPLOAD_DIR = resolve(process.cwd(), 'uploads');

export interface FichierTeleverse {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UtilisateurCourant {
  id: number;
  role: Role;
}

export interface TeleversementDto {
  titre?: string;
  promotionId?: string;
  canalId?: string;
  visiblePar?: string; // ex. "ADMIN,FORMATEUR" (par défaut : tous les rôles)
}

const SELECTION_PUBLIQUE = {
  id: true,
  titre: true,
  nomFichier: true,
  typeMime: true,
  tailleOctets: true,
  promotionId: true,
  canalId: true,
  visiblePar: true,
  createdAt: true,
  auteur: { select: { id: true, prenom: true, nom: true } },
} as const;

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async lister(user: UtilisateurCourant, promotionId?: string, canalId?: string) {
    const promo = this.entierOptionnel(promotionId, 'promotionId');
    const canal = this.entierOptionnel(canalId, 'canalId');
    const estAdmin = user.role === Role.ADMIN;

    return this.prisma.document.findMany({
      where: {
        ...(promo !== undefined && { promotionId: promo }),
        ...(canal !== undefined && { canalId: canal }),
        ...(!estAdmin && {
          visiblePar: { has: user.role },
          OR: [
            { promotionId: null },
            { promotion: { formateurId: user.id } },
            { promotion: { inscriptions: { some: { etudiantId: user.id } } } },
          ],
        }),
      },
      select: SELECTION_PUBLIQUE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async televerser(user: UtilisateurCourant, fichier: FichierTeleverse | undefined, dto: TeleversementDto) {
    if (!fichier) throw new BadRequestException('Fichier manquant (champ "file")');

    const titre = dto.titre?.trim();
    if (!titre || titre.length > 200) {
      throw new BadRequestException('Titre obligatoire (200 caractères maximum)');
    }

    let promotionId = this.entierOptionnel(dto.promotionId, 'promotionId');
    const canalId = this.entierOptionnel(dto.canalId, 'canalId');

    if (canalId !== undefined) {
      const canal = await this.prisma.canal.findUnique({ where: { id: canalId } });
      if (!canal) throw new BadRequestException('Canal inconnu');
      promotionId ??= canal.promotionId ?? undefined;
    }

    if (promotionId !== undefined && !(await this.appartientALaPromotion(user, promotionId))) {
      throw new ForbiddenException("Vous n'appartenez pas à cette promotion");
    }

    const visiblePar = this.parserRoles(dto.visiblePar);

    // multer lit les noms de fichiers en latin1 : on les remet en UTF-8
    const nomFichier = basename(Buffer.from(fichier.originalname, 'latin1').toString('utf8')).slice(0, 200);
    const extension = extname(nomFichier).toLowerCase();
    const extensionSure = /^\.[a-z0-9]{1,10}$/.test(extension) ? extension : '';

    await mkdir(UPLOAD_DIR, { recursive: true });
    const nomStocke = `${randomUUID()}${extensionSure}`;
    await writeFile(join(UPLOAD_DIR, nomStocke), fichier.buffer);

    try {
      return await this.prisma.document.create({
        data: {
          titre,
          nomFichier,
          cheminStockage: `uploads/${nomStocke}`,
          typeMime: fichier.mimetype,
          tailleOctets: fichier.size,
          auteurId: user.id,
          promotionId,
          canalId,
          visiblePar,
        },
        select: SELECTION_PUBLIQUE,
      });
    } catch (erreur) {
      await rm(join(UPLOAD_DIR, nomStocke), { force: true }); // pas de fichier orphelin
      throw erreur;
    }
  }

  async cheminPourTelechargement(user: UtilisateurCourant, id: number) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document introuvable');

    const autorise =
      user.role === Role.ADMIN ||
      (doc.visiblePar.includes(user.role) &&
        (doc.promotionId === null || (await this.appartientALaPromotion(user, doc.promotionId))));
    if (!autorise) throw new ForbiddenException('Accès refusé à ce document');

    const chemin = resolve(process.cwd(), doc.cheminStockage);
    if (!chemin.startsWith(UPLOAD_DIR + sep)) {
      throw new ForbiddenException('Chemin de fichier invalide');
    }
    if (!existsSync(chemin)) {
      throw new NotFoundException('Le fichier est absent du disque');
    }
    return { chemin, nomFichier: doc.nomFichier };
  }

  private async appartientALaPromotion(user: UtilisateurCourant, promotionId: number) {
    if (user.role === Role.ADMIN) return true;
    const promotion = await this.prisma.promotion.findFirst({
      where: {
        id: promotionId,
        OR: [{ formateurId: user.id }, { inscriptions: { some: { etudiantId: user.id } } }],
      },
      select: { id: true },
    });
    return promotion !== null;
  }

  private entierOptionnel(valeur: string | undefined, nom: string): number | undefined {
    if (valeur === undefined || valeur === '') return undefined;
    const n = Number(valeur);
    if (!Number.isInteger(n) || n <= 0) throw new BadRequestException(`${nom} invalide`);
    return n;
  }

  private parserRoles(valeur?: string): Role[] {
    if (!valeur) return [Role.ADMIN, Role.FORMATEUR, Role.ETUDIANT];
    const roles = valeur.split(',').map((r) => r.trim().toUpperCase());
    const valides = Object.values(Role) as string[];
    if (roles.some((r) => !valides.includes(r))) {
      throw new BadRequestException(`visiblePar : valeurs possibles ${valides.join(', ')}`);
    }
    return roles as Role[];
  }
}
