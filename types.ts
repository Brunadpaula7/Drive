
export interface Logo {
  id: string;
  name: string;
  imgSrc: string;
  href?: string;
  modalId?: string;
}

export interface CitySection {
    id: string;
    city: string;
    logos: Logo[];
}

export type LogoData = (Logo | CitySection)[];

export interface Job {
    id: string;
    job: string;
    jt: string;
    property: string;
    agents: string[];
    raw: string;
    description?: string;
    area?: string | number;
    areaTotal?: string | number;
    quartos?: string | number;
    salas?: string | number;
    condominio?: string | number;
    iptu?: string | number;
    iptuTipo?: string;
    title?: string;
    suites?: string | number;
    bathrooms?: string | number;
    parking?: string | number;
    locationDetails?: string;
    price?: string | number;
    photos?: string[];
    url?: string;
    features?: string[];
    operacao?: string;
    tipo?: string;
}

export interface LaunchProject {
    id:string;
    name: string;
    builder: string;
    location: string;
    status: string;
    delivery: string;
    typologies: string;
    size: string;
    price: string;
    description: string;
}

export interface PipelineEvent {
    id: string;
    day: string;
    name: string;
}

export interface PipelineMonth {
    month: string;
    year: string;
    events: PipelineEvent[];
}

export interface InfoBoardData {
  rodadas: string[];
  meeting: string[];
  // Fix: Renamed 'deadlines' to 'lancamentos' and removed other unused fields to match component usage.
  lancamentos: string[];
}
