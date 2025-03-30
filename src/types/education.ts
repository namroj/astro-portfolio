import type { z } from "astro:content";
import type { education } from "../content.config";

export type EducationSchema = {
    name: string;
    summary: string;
    description: string;
    url: string;
    logo: string;
    bg_color: string;
    tags: string[];
    year: number;
    visible: boolean;
}; 