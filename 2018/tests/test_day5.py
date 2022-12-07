import unittest

def getRealInput():
    with open('tests/day{}_input.txt'.format(5), mode='r',) as f:
        return f.read()

def getTestInput():
    return 'dabAcCaCBAcCcaDA'

class Day3(unittest.TestCase):
    def setUp(self):
        print('start')

    def test_print(self):
        print('print')
        self.assertTrue(True)
        
        
        
if __name__ == '__main__':
    unittest.main()