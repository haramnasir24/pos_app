import { auth } from "~/auth";

export async function GET(request: Request) {
    const session = await auth();
    if (!session) return new Response('Unauthorized', { status: 401 });
    
    // Fetch products from Square API
    // Return formatted product data
}