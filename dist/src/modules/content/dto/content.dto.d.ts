export declare class CreateContentDto {
    title: string;
    slug: string;
    body: any;
    status?: string;
    author: string;
    tags?: string[];
    excerpt?: string;
    featuredImage?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateContentDto {
    title?: string;
    slug?: string;
    body?: any;
    status?: string;
    tags?: string[];
    excerpt?: string;
    featuredImage?: string;
    metadata?: Record<string, any>;
}
