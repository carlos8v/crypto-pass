export async function getInfo() {
  const response = await fetch('scripts/info.json');
  const data = await response.json();
  return data;
}