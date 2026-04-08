export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admins-piruza/', '/api/', '/cabinet/'],
            },
        ],
        sitemap: 'https://piruzastore.online/sitemap.xml',
    };
}