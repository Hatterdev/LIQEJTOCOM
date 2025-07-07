import { NextResponse } from "next/server"

interface PoolDetails {
    data: {
        attributes: {
            id: string
            price_in_usd: string
        }
    }

}
export async function GET(req: Request, { params }: { params: Promise<{ pools: string }> }) {
    const { pools } = await params
    try {
        const data = await fetch(`${process.env.GECKO_API_URL}/p1/bsc/pools/${pools}?include=pairs`, {
            next: {
                revalidate: 60, // Revalidate every 60 seconds
            },
        })

        const response: PoolDetails = await data.json()

        return NextResponse.json(response.data.attributes.price_in_usd, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=60', // Cache for 60 seconds
            },
        })
    } catch (error) {
        console.log("GET_DETAILS:", error);
        return NextResponse.json("Hmm, something went wrong", { status: 500 });
    }
}