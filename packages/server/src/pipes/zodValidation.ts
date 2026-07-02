import { BadRequestException, Injectable, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";

/**
 * Validates a Nest controller argument against a Zod schema. Throws
 * `BadRequestException` with the schema error tree on failure so clients get
 * a 400 response with actionable detail.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }
    return result.data;
  }
}
