from expiry_process import convert_to_date
import sys
import os
import numpy as np
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def test_process_expiry_date():

    #list of dicts as returned by convert_to_numerical
    test_cases = [
        #MMYYYY
        {'text': '122023', 'placeholder': 'M122023', 'extracted': None, 'month': '12'},
        #DDMMYYYY format
        {'text': '15112023', 'placeholder': '15112023', 'extracted': None, 'month': None},
        #YYYYMMDD format
        {'text': '20240228', 'placeholder': '20240228', 'extracted': None, 'month': None},
        #MMDDYYYY format (common US)
        {'text': '02012024', 'placeholder': 'M02012024', 'extracted': None, 'month': '02'},
        #MMDDYY format
        {'text': '012027', 'placeholder': 'M012027', 'extracted': None, 'month': '01'},
        #fallback: unrecognised format, should return original
        {'text': 'ABCD', 'placeholder': 'ABCD', 'extracted': None, 'month': None}
    ]

    expected_results = ["2023-12-30","2023-11-15","2024-02-28","2024-02-01","2027-01-30","ABCD"]

    results = convert_to_date(test_cases)

    assert results == expected_results