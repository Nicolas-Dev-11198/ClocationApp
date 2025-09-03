export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown, data?: Record<string, unknown>) => string | null;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
  min?: number;
  max?: number;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: unknown, rule: ValidationRule, fieldName: string): string | null => {
  // Required validation
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${fieldName} est requis`;
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    // Min length
    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} doit contenir au moins ${rule.minLength} caractères`;
    }

    // Max length
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${fieldName} ne peut pas dépasser ${rule.maxLength} caractères`;
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${fieldName} doit être une adresse email valide`;
      }
    }

    // Phone validation (French format)
    if (rule.phone) {
      const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return `${fieldName} doit être un numéro de téléphone valide`;
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${fieldName} n'est pas dans le format attendu`;
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return `${fieldName} doit être supérieur ou égal à ${rule.min}`;
    }

    if (rule.max !== undefined && value > rule.max) {
      return `${fieldName} doit être inférieur ou égal à ${rule.max}`;
    }
  }

  // Date validation
  if (rule.date) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} doit être une date valide`;
    }
  }

  // Custom validation
  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

export const validateForm = (data: Record<string, unknown>, schema: ValidationSchema): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(schema).forEach(fieldName => {
    const rule = schema[fieldName];
    const value = data[fieldName];
    const error = validateField(value, rule, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Common validation schemas
export const userValidationSchema: ValidationSchema = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    email: true
  },
  phone: {
    phone: true
  },
  role: {
    required: true
  }
};

export const loginValidationSchema: ValidationSchema = {
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 6
  }
};

export const logbookValidationSchema: ValidationSchema = {
  pirogue: {
    required: true
  },
  captain: {
    required: true
  },
  departureTime: {
    required: true,
    date: true
  },
  returnTime: {
    date: true,
    custom: (value, data) => {
      if (value && data?.departureTime) {
        const departure = new Date(data.departureTime as string);
        const returnTime = new Date(value as string);
        if (returnTime <= departure) {
          return 'L\'heure de retour doit être postérieure à l\'heure de départ';
        }
      }
      return null;
    }
  },
  fuelStart: {
    required: true,
    min: 0,
    max: 100
  },
  fuelEnd: {
    min: 0,
    max: 100
  }
};

export const maintenanceValidationSchema: ValidationSchema = {
  pirogue: {
    required: true
  },
  technician: {
    required: true
  },
  date: {
    required: true,
    date: true
  },
  type: {
    required: true
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  cost: {
    min: 0
  }
};

export const bookingValidationSchema: ValidationSchema = {
  pirogue: {
    required: true
  },
  client: {
    required: true
  },
  startDate: {
    required: true,
    date: true
  },
  endDate: {
    required: true,
    date: true,
    custom: (value, data) => {
      if (value && data?.startDate) {
        const start = new Date(data.startDate as string);
        const end = new Date(value as string);
        if (end <= start) {
          return 'La date de fin doit être postérieure à la date de début';
        }
      }
      return null;
    }
  },
  totalCost: {
    required: true,
    min: 0
  }
};