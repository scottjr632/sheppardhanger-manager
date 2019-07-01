import http.server
import socketserver
import io
from collections import OrderedDict
from typing import List

import xlsxwriter

HEADERS = OrderedDict([
    ('House', 'house'),
    ('Room', 'room'),
    ('Booking status', 'bookingtype'),
    ('Check-in', 'checkindate'),
    ('Check-out', 'checkoutdate'),
    ('Length of stay', 'lengthofstay'),
    ('First name', 'lesseefname'),
    ('Last name', 'lesseelname'),
    ('Email', 'lesseeemail'),
    ('Purpose', 'purpose'),
    ('Notes', 'notes'),
])

def format_calendar(lessee, reservation) -> dict:
    pass
    

def create_calender_file(reservations: List[dict]):
    # Create an in-memory output file for the new workbook.
    output = io.BytesIO()

    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()

    date_format = workbook.add_format({'num_format': 'dd/mm/yy'})

    # write the headers
    for index, header in enumerate(HEADERS):
        worksheet.write(0, index, header)

    # write values
    for index, reservation in enumerate(reservations):
        for j, key in enumerate(HEADERS):
            value = HEADERS[key]
            if value == 'checkindate' or value == 'checkoutdate':
                worksheet.write(index + 1, j, reservation[value], date_format)
            else:
                worksheet.write(index + 1, j, reservation[value])

    # Close the workbook before stream  ing the data.
    workbook.close()

    # Rewind the buffer.
    output.seek(0)

    return output


# Construct a server response.
# .send_response(200)
# self.send_header('Content-Disposition', 'attachment; filename=test.xlsx')
# self.send_header('Content-type',
#                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
# self.end_headers()
# self.wfile.write(output.read())
# print('Server listening on port 8000...')
# httpd = socketserver.TCPServer(('', 8000), Handler)
# httpd.serve_forever()
