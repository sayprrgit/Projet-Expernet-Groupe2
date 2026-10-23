import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PlanningType } from '../generated/prisma/client.js';

export interface PlanningEntryDto {
  id: string;
  title: string;
  kind: 'formation' | 'evenement' | 'atelier' | 'examen';
  date: string;
  endDate?: string;
  time?: string;
  site: string;
  description: string;
  link?: { label: string; to: string };
}

const TYPE_TO_API: Record<PlanningType, PlanningEntryDto['kind']> = {
  [PlanningType.FORMATION]: 'formation',
  [PlanningType.EVENEMENT]: 'evenement',
  [PlanningType.ATELIER]: 'atelier',
  [PlanningType.EXAMEN]: 'examen',
};

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class PlanningService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PlanningEntryDto[]> {
    const events = await this.prisma.planningEvent.findMany({
      orderBy: { date: 'asc' },
    });

    return events.map((event) => ({
      id: String(event.id),
      title: event.titre,
      kind: TYPE_TO_API[event.type],
      date: toDateString(event.date),
      endDate: event.dateFin ? toDateString(event.dateFin) : undefined,
      time: event.heure ?? undefined,
      site: event.site,
      description: event.description,
      link:
        event.lienLabel && event.lienUrl
          ? { label: event.lienLabel, to: event.lienUrl }
          : undefined,
    }));
  }
}
