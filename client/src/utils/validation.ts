export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return "Email is required.";
  }
  const emailRegex =
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  const trimmedPassword = password.trim();

  const hasLowercase = /[a-z]/.test(trimmedPassword);
  const hasUppercase = /[A-Z]/.test(trimmedPassword);
  const hasNumber = /\d/.test(trimmedPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
    trimmedPassword
  );
  const isLongEnough = trimmedPassword.length >= 10;

  if (!trimmedPassword) {
    return "Password is required.";
  }
  if (!isLongEnough) {
    return "Password must be at least 10 characters.";
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasNumber) {
    return "Password must contain at least one digit.";
  }
  if (!hasSpecial) {
    return "Password must contain at least one special character.";
  }
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword.trim()) {
    return "Confirm password is required.";
  }
  if (password.trim() !== confirmPassword.trim()) {
    return "Passwords must match.";
  }
  return null;
}

export function validateName(name: string): string | null {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9._'\-\s]{2,}$/;

  if (!name.trim()) {
    return "Field is required.";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }

  if (!nameRegex.test(name)) {
    return "Name contains invalid characters.";
  }
  return null;
}

export function validateUsername(name: string): string | null {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'_. -]{2,}$/;

  if (!name.trim()) {
    return "Field is required.";
  }

  if (name.trim().length < 2) {
    return "Username must be at least 2 characters long.";
  }

  if (!nameRegex.test(name)) {
    return "Username contains invalid characters.";
  }
  return null;
}

export function validateNotRequiredName(name: string): string | null {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'_. -]{2,}$/;

  if (!name.trim()) return null;

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }

  if (!nameRegex.test(name)) {
    return "Name must be at least 2 characters and contain only letters, spaces, hyphens or apostrophes.";
  }
  return null;
}

export function validateHeadline(headline: string): string | null {
  // Allows letters, numbers, space, underscore, dot, comma, exclamation, question mark, single/double quotes, hyphen
  const headlineRegex = /^[a-zA-Z0-9 _.,!?'"-]+$/;

  if (!headline.trim()) return null;

  if (headline.trim().length < 2 || headline.trim().length > 50) {
    return "Headline must be between 2 and 50 characters.";
  }

  if (!headlineRegex.test(headline)) {
    return "Headline contains invalid characters.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmedPhone = phone.trim();

  const phoneRegex =
    /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

  if (!trimmedPhone) {
    return "Phone is required.";
  }
  if (!phoneRegex.test(trimmedPhone)) {
    return "Invalid phone number format.";
  }

  return null;
}

export function validatePostalCode(postalCode: string): string | null {
  const trimmed = postalCode.trim();

  if (!trimmed) {
    return "Postal code is required.";
  }

  // Generic: at least 4 characters, alphanumeric, allows space or dash
  const postalRegex = /^[A-Za-z0-9][A-Za-z0-9\s-]{3,}$/;

  if (!postalRegex.test(trimmed)) {
    return "Invalid postal code format.";
  }

  return null;
}

export function validateStreet(street: string): string | null {
  const trimmed = street.trim();

  if (!trimmed) {
    return "Street is required.";
  }

  // Minimum length check
  if (trimmed.length < 3) {
    return "Street must be at least 3 characters long.";
  }

  // Only allow letters, numbers, commas, dots, dashes and spaces
  const streetRegex = /^[A-Za-z0-9șȘțȚăĂâÂîÎéè.,\- ]+$/u;

  if (!streetRegex.test(trimmed)) {
    return "Street contains invalid characters.";
  }

  return null;
}

export function validateImageFile(file: File) {
  const allowedTypes = [
    "image/tiff",
    "image/bmp",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const allowedExtensions = [
    ".tiff",
    ".bmp",
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return "Unsupported file extension. Allowed: tiff, bmp, avif, gif, jpeg, jpg, png, webp";
  }

  if (!allowedTypes.includes(file.type)) {
    return "Unsupported media format. Allowed: tiff, bmp, avif, gif, jpeg, jpg, png, webp";
  }

  if (file.size > maxSize) {
    return "File size must be less than 10MB.";
  }

  return null;
}

export function validateHourlyRate(hourlyRate: number) {
  if (isNaN(hourlyRate)) return "Hourly rate must be a number.";

  if (hourlyRate < 0) return "Hourly rate must be greater than 0.";

  /* if (hourlyRate < 5) return "Hourly rate must be at least $5."; */

  if (hourlyRate > 1000)
    return "Hourly rate seems too high. Must be under $1000.";

  const decimalPlaces = hourlyRate.toString().split(".")[1];
  if (decimalPlaces && decimalPlaces.length > 2) {
    return "Hourly rate can have up to two decimal places.";
  }

  return null;
}

export function validateUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null; // empty is allowed

  let urlToCheck = trimmed;

  // If no scheme, prepend https://
  if (!/^https?:\/\//i.test(trimmed)) {
    urlToCheck = `https://${trimmed}`;
  }

  try {
    const url = new URL(urlToCheck);
    // Optional: allow only http or https
    if (!["http:", "https:"].includes(url.protocol)) {
      return "URL must start with http:// or https://";
    }
    return null;
  } catch {
    return "Invalid URL format.";
  }
}

export function validateSocialLinks(links: string[]): (string | null)[] {
  return links.map((link) => {
    if (!link.trim()) return null; // empty is valid
    return validateUrl(link) ?? null; // reuse your URL validator
  });
}

export function validateSkills(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const allowedCharsRegex = /^[A-Za-z0-9șȘțȚăĂâÂîÎéè.\-+#/()&*: ]+$/u;
  const skills = trimmed.split(",").map((s) => s.trim());

  if (skills.some((skill) => skill.length === 0)) {
    return "Skills must not contain empty entries.";
  }

  for (const skill of skills) {
    if (!allowedCharsRegex.test(skill)) {
      return `Skill '${skill}' contains invalid characters.`;
    }
    if (skill.length < 1) {
      return `Skill '${skill}' is too short.`;
    }
  }

  return null;
}

export function validateText(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  if (trimmed.length > 1000) {
    return "About section must be under 1000 characters.";
  }

  const allowedCharsRegex = /^[A-Za-z0-9șȘțȚăĂâÂîÎéè./\-+#_=*&%$@()!?:;, ]+$/u;

  if (!allowedCharsRegex.test(trimmed)) {
    return "About section contains invalid characters.";
  }

  return null;
}
