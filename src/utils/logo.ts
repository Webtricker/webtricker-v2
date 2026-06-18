
export const getSiteLogos = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/logos`, {
      // TEMP: revalidate=0 for active dev — RESET before launch (was: 3600)
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const result = await res.json();

    if(!result || !result?.data) return null;
    return result.data;
  } catch (error) {
    console.log('Error fetching site logos ', error);
    return null;
  }
}