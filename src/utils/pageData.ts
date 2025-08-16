export const getTeamData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teams`);

        if (!res.ok) {
            console.error("Failed to fetch team data");
            return [];
        }
        const result = await res.json();
        return result?.teamData || [];
    } catch (error) {
        console.error("Error fetching team data:", error);
        return [];
    }
}

export const getTestimonialsData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`);

        if (!res.ok) {
            console.error("Failed to fetch testimonial data");
            return [];
        }
    const result = await res.json();
        return result?.testimonialsData || [];
    } catch (error) {
        console.error("Error fetching testimonial data:", error);
        return [];
    }
}

export const getPortfoliosData = async (limit=6) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios?limit=${limit}`);

        if (!res.ok) {
            console.error("Failed to fetch portfolios data");
            return [];
        }
    const result = await res.json();
        return result?.portfolios || [];
    } catch (error) {
        console.error("Error fetching portfolios data:", error);
        return [];
    }
}

export const getServicesData = async (limit:number=99) => {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?limit=${limit}`);

        if (!res.ok) {
            console.error("Failed to fetch services");
            return [];
        }
    const result = await res.json();
        return result?.services || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}