import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";

class TemplateEngine {
  private initialized = false;

  /**
   * Register Handlebars Partials
   */
  private async registerPartials(): Promise<void> {
    if (this.initialized) return;

    const partialsDir = path.join(
      process.cwd(),
      "src",
      "templates",
      "partials"
    );

    const partialFiles = await fs.readdir(partialsDir);

    for (const file of partialFiles) {
      if (!file.endsWith(".hbs")) continue;

      const partialName = path.basename(file, ".hbs");

      const partialContent = await fs.readFile(
        path.join(partialsDir, file),
        "utf-8"
      );

      handlebars.registerPartial(partialName, partialContent);
    }

    this.initialized = true;
  }

  /**
   * Render Template
   */
  async render(
    templateName: string,
    context: Record<string, unknown>
  ): Promise<string> {
    await this.registerPartials();

    const layoutPath = path.join(
      process.cwd(),
      "src",
      "templates",
      "layouts",
      "main.hbs"
    );

    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      `${templateName}.hbs`
    );

    const [layoutSource, templateSource] = await Promise.all([
      fs.readFile(layoutPath, "utf-8"),
      fs.readFile(templatePath, "utf-8"),
    ]);

    /**
     * Compile Body
     */
    const bodyTemplate = handlebars.compile(templateSource);

    const body = bodyTemplate({
      ...context,
      year: new Date().getFullYear(),
    });

    /**
     * Compile Layout
     */
    const layoutTemplate = handlebars.compile(layoutSource);

    return layoutTemplate({
      ...context,
      year: new Date().getFullYear(),
      body,
    });
  }
}

export default new TemplateEngine();