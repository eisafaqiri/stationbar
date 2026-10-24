export const topics = [
  "Allgemeine Anfrage",
  "Tischanfrage",
  "Event & Feier",
] as const;
export type ContactData = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};
export function validateContact(value: unknown): ContactData | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.consent !== true) return null;
  const field = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";
  const result = {
    name: field("name"),
    email: field("email"),
    phone: field("phone"),
    topic: field("topic"),
    message: field("message"),
  };
  if (
    result.name.length < 2 ||
    result.name.length > 100 ||
    /[\r\n\x00-\x1f]/.test(result.name)
  )
    return null;
  if (
    result.email.length > 254 ||
    !/^[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(
      result.email,
    )
  )
    return null;
  if (
    result.phone.length > 40 ||
    (result.phone && !/^[+\d\s()./-]{5,40}$/.test(result.phone))
  )
    return null;
  if (
    !topics.some((topic) => topic === result.topic) ||
    result.message.length < 10 ||
    result.message.length > 5000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(result.message)
  )
    return null;
  return result;
}
