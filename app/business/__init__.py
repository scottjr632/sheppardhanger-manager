from docx import Document

from datetime import datetime

import app.models.models as models


MASTER_CONTRACT = 'templates/Master Contract.docx'

MONTH_STRS_ABRV = {
    1: 'JAN',
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAY',
    6: 'JUN',
    7: 'JULY',
    8: 'AUG',
    9: 'SEP',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC'
}


def build_user_info(lessee: models.Lessee, reservation: models.Reservation) -> dict:
    """ builds dict from lessee model for use with master contract """
    today = datetime.today()

    return {
        '**DAY**': str(today.date),
        '**MONTH**': MONTH_STRS_ABRV[today.month],
        '**LESSEENAME**': '{}, {}'.format(lessee.lname, lessee.fname),
        '**LESSEECITY**': lessee.city,
        '**LESSEEADDRESS**' : lessee.address,
        '**LESSEESTATE**': lessee.state,
        '**LESSEEZIP**' : lessee.zipcode,
        '**LESSEEPHONE**': lessee.phone,
        '**LESSEEEMAIL**': lessee.email,
        '**STARTDAY**': reservation.checkindate,
        '**STARTMONTH**': '',
        '**ENDDAY**': reservation.checkoutdate,
        '**ENDMONTH**': ''
    }


def search_and_replace_master_contract(lessee_info: dict, file_save_location: str = '') -> bool:
    """ searches and replaces from key value dict. then saves new file """

    doc = Document(MASTER_CONTRACT)
    for para in doc.paragraphs:
        for key, value in lessee_info.items():
            if key in para.text:
                para.text = str(para.text).replace(key, value)

    doc.save(file_save_location)


def save_file(doc: Document, file_name: str):
    doc.save(file_name)
