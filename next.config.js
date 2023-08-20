/** @type {import('next').NextConfig} */


const nextConfig = {
    output: 'export',
    experimental:{
        serverComponentsExternalPackages: ['@prisma/client','bcrypt']
    },
    images:{
        domains:[
            "res.cloudinary.com"
        ]
    },
}

module.exports = nextConfig
