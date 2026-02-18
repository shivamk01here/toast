export async function getUserCountry(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code; // Returns 'IN' for India
  } catch (error) {
    console.error("Failed to fetch location", error);
    return null;
  }
}
