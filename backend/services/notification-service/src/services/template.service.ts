import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const templatesPath = path.join(
  process.cwd(),
  "src",
  "templates"
);

export function renderTemplate(
  templateName: string,
  data: Record<string, any> = {}
) {
  const templatePath = path.join(
    templatesPath,
    `${templateName}.hbs`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Email template not found: ${templateName}`
    );
  }

  const source = fs.readFileSync(
    templatePath,
    "utf-8"
  );

  const template = Handlebars.compile(source);

  return template(data);
}