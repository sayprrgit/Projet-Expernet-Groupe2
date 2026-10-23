import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface UtilisateurCourant {
  id: number;
  role: Role;
}

export interface NouveauMessageDto {
  contenu?: string;
  parentId?: number | string | null;
}

const LONGUEUR_MAX = 2000;
const LIMITE_HISTORIQUE = 200;

const SELECTION_MESSAGE = {
  id: true,
  canalId: true,
  contenu: true,
  parentId: true,
  createdAt: true,
  modifieLe: true,
  auteur: { select: { id: true, prenom: true, nom: true, role: true } },
} as const;

@Injectable()
export class CanauxService {
  constructor(private readonly prisma: PrismaService) {}

  // Admin : tous les canaux. Autres rôles : canaux généraux et canaux de leurs promotions.
  lister(user: UtilisateurCourant) {
    const filtre =
      user.role === Role.ADMIN
        ? {}
        : {
            OR: [
              { promotionId: null },
              { promotion: { formateurId: user.id } },
              { promotion: { inscriptions: { some: { etudiantId: user.id } } } },
            ],
          };

    return this.prisma.canal.findMany({
      where: filtre,
      select: {
        id: true,
        nom: true,
        promotionId: true,
        promotion: { select: { id: true, nom: true } },
        _count: { select: { messages: true, documents: true } },
      },
      orderBy: [{ promotionId: { sort: 'asc', nulls: 'first' } }, { nom: 'asc' }],
    });
  }

  async messages(user: UtilisateurCourant, canalId: number) {
    await this.verifierAcces(user, canalId);
    const derniers = await this.prisma.message.findMany({
      where: { canalId },
      select: SELECTION_MESSAGE,
      orderBy: { createdAt: 'desc' },
      take: LIMITE_HISTORIQUE,
    });
    return derniers.reverse(); // du plus ancien au plus récent
  }

  async envoyer(user: UtilisateurCourant, canalId: number, dto: NouveauMessageDto) {
    await this.verifierAcces(user, canalId);

    const contenu = typeof dto.contenu === 'string' ? dto.contenu.trim() : '';
    if (!contenu || contenu.length > LONGUEUR_MAX) {
      throw new BadRequestException(`Message vide ou trop long (${LONGUEUR_MAX} caractères maximum)`);
    }

    let parentId: number | null = null;
    if (dto.parentId !== undefined && dto.parentId !== null && dto.parentId !== '') {
      const id = Number(dto.parentId);
      if (!Number.isInteger(id) || id <= 0) throw new BadRequestException('parentId invalide');
      const parent = await this.prisma.message.findUnique({
        where: { id },
        select: { id: true, canalId: true, parentId: true },
      });
      if (!parent || parent.canalId !== canalId) {
        throw new BadRequestException("Le message parent n'appartient pas à ce canal");
      }
      // Un seul niveau de fil : une réponse à une réponse est rattachée au message d'origine
      parentId = parent.parentId ?? parent.id;
    }

    return this.prisma.message.create({
      data: { canalId, auteurId: user.id, contenu, parentId },
      select: SELECTION_MESSAGE,
    });
  }

  private async verifierAcces(user: UtilisateurCourant, canalId: number) {
    const canal = await this.prisma.canal.findUnique({
      where: { id: canalId },
      select: { id: true, promotionId: true },
    });
    if (!canal) throw new NotFoundException('Canal introuvable');
    if (canal.promotionId === null || user.role === Role.ADMIN) return;

    const membre = await this.prisma.promotion.findFirst({
      where: {
        id: canal.promotionId,
        OR: [{ formateurId: user.id }, { inscriptions: { some: { etudiantId: user.id } } }],
      },
      select: { id: true },
    });
    if (!membre) throw new ForbiddenException("Vous n'êtes pas membre de ce canal");
  }
}
