import api from './api';

export interface EducationDto {
    id?: string;
    schoolName: string;
    fieldOfStudy: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
    isCurrent: boolean;
}

export interface ExperienceDto {
    id?: string;
    companyName: string;
    position: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isCurrent: boolean;
}

export interface SkillDto {
    id?: string;
    name: string;
    level?: string;
}

// Aliases for easier usage
export interface LanguageDto {
    id?: string;
    name: string;
    level: string; // Basic, Fluent, Native etc.
}

export interface CertificateDto {
    id?: string;
    name: string;
    issuer?: string;
    date?: string;
    url?: string;
}

export type Education = EducationDto;
export type Experience = ExperienceDto;
export type Skill = SkillDto;
export type Language = LanguageDto;
export type Certificate = CertificateDto;

export interface CvData {
    id?: string;
    summary?: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    educations: EducationDto[];
    experiences: ExperienceDto[];
    skills: SkillDto[];
    languages: LanguageDto[];
    certificates: CertificateDto[];
    cvTitle?: string;
    profileImage?: string; // Base64 string for profile picture
    themeColor?: string; // Hex color code for Header Background
    accentColor?: string; // Hex color code for Titles, Icons, Borders
}

export const cvService = {
    getCv: async (): Promise<CvData> => {
        const response = await api.get('/cv');
        return response.data;
    },

    saveCv: async (data: CvData): Promise<void> => {
        await api.post('/cv', data);
    },

    downloadCv: async (): Promise<void> => {
        const response = await api.get('/cv/download', {
            responseType: 'blob', // Dosya indireceğimiz için blob önemli
        });

        // Tarayıcıda indirme işlemini tetikle
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Backend header'dan dosya adını çekmeye çalış, yoksa default ver
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'My_CV.docx';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2)
                fileName = fileNameMatch[1].replace(/"/g, ''); // Tırnakları temizle
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
