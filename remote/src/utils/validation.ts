export function isValidIpv4(value: string): boolean {
  const octets = value.split('.');

  return (
    octets.length === 4 &&
    octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) >= 0 && Number(octet) <= 255)
  );
}

export function isValidPort(value: string | null): boolean {
  if (!value || !/^\d+$/.test(value)) return false;

  const port = Number(value);
  return port >= 1 && port <= 65535;
}
