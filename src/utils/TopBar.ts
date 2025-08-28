export const getTobBarInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/top-header`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const result = await res.json();

    if (!result || !result?.data) return null;
    return result.data;
  } catch (error) {
    console.log("Error fetching site logos ", error);
    return null;
  }
};
