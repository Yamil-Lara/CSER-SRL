export interface ProfileData {
  nombre: string;
  username: string;
  email: string;
  profesion: string;
  especialidad: string;
  biografia: string;
  ubicacion: string;
  telefono?: string;
  universidad?: string;
  carrera?: string;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  password?: string;
  image_url?: string | null;
}
