export async function findEmail(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/verify-email?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
}
