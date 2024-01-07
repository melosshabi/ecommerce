/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'http',
                hostname:'res.cloudinary.com',
                port:'',
            }
        ]
    },
    env:{
        REQ_URL:process.env.REQ_URL
    }
}

module.exports = nextConfig
