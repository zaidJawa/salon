import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin
import { GeneratePdfOptions } from "../types";



export async function generateBookingsPdf({
    title = "Booking Details",
    bookings,
}: GeneratePdfOptions): Promise<Buffer> {
    const doc: any = new jsPDF("l", "mm", "a4");

    // Set Title
    doc.setFontSize(16);
    doc.text(title, 10, 10);

    const tableHeaders = [
        "Date",
        "User Name",
        "User Email",
        "User Phone",
        "Salon Name",
        "Salon Location",
        "Salon Phone",
        "Service Name",
        "Service Price"
    ];

    const tableData = bookings.map((entry) => {
        const {
            booking: { date, status },
            user: { name, email, phone },
            services,
            beautySalon: { name: salonName, location, phone: salonPhone },
        } = entry;

        return services.map((service) => [
            new Date(date).toLocaleString(), // Date
            name,                           // User Name
            email,                          // User Email
            phone,                          // User Phone
            salonName,                      // Salon Name
            location,                       // Salon Location
            salonPhone,                     // Salon Phone
            service.serviceName,            // Service Name
            `$${service.servicePrice.toFixed(2)}`, // Service Price
        ]);
    }).flat(); // Flatten the array to have one list of rows

    // Set up table columns width
    const colWidths = [30, 40, 50, 40, 40, 50, 40, 50, 30];

    // Table Formatting
    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 20, // Table starts after the title
        columnStyles: {
            0: { cellWidth: colWidths[0] },
            1: { cellWidth: colWidths[1] },
            2: { cellWidth: colWidths[2] },
            3: { cellWidth: colWidths[3] },
            4: { cellWidth: colWidths[4] },
            5: { cellWidth: colWidths[5] },
            6: { cellWidth: colWidths[6] },
            7: { cellWidth: colWidths[7] },
            8: { cellWidth: colWidths[8] },
        },
        theme: "grid", // Styling of the table
        headStyles: { fillColor: [255, 220, 220] },
        margin: { top: 20 },
    });

    // Generate PDF as a Uint8Array
    const pdfOutput = doc.output("arraybuffer");

    // Convert to Buffer
    return Buffer.from(pdfOutput);
}
