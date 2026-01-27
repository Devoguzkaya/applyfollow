
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const { html, themeConfig } = await req.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Construct the full HTML document
        // We inject Tailwind CDN and custom CSS variables to match the frontend look
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CV PDF</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script>
                    tailwind.config = {
                        theme: {
                            extend: {
                                colors: {
                                    primary: '${themeConfig?.primary || "#17cf63"}',
                                    "primary-dark": '${themeConfig?.primaryDark || "#14b556"}',
                                    "background-main": "#ffffff",
                                    "surface-card": "#ffffff",
                                    "text-main": "#0f172a",
                                    "text-muted": "#64748b",
                                    "border-main": "#e2e8f0"
                                },
                                fontFamily: {
                                    display: ['Space Grotesk', 'sans-serif'],
                                    body: ['Noto Sans', 'sans-serif'],
                                }
                            }
                        }
                    }
                </script>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <style>
                    body {
                        background-color: white;
                        margin: 0;
                        padding: 0;
                    }
                    /* Ensure icons align properly */
                    .material-symbols-outlined {
                        vertical-align: middle;
                    }
                    /* Custom Scrollbar hide for PDF */
                    ::-webkit-scrollbar {
                        display: none;
                    }
                    
                    /* Print specific overrides */
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                    
                    /* Helper to ensure A4 dimensions */
                    .a4-container {
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0 auto;
                        background: white;
                        overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <div class="a4-container">
                    ${html}
                </div>
            </body>
            </html>
        `;

        await page.setContent(fullHtml, {
            waitUntil: 'networkidle0', // Wait for fonts and CDN to load
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        });

        await browser.close();

        // Return the PDF
        return new NextResponse(pdfBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="cv.pdf"',
            },
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
