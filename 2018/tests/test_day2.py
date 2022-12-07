import config
import itertools
import logging
import unittest
import urllib.request

log = logging.getLogger(__name__)

def getRealInput():
    url = 'https://adventofcode.com/2018/day/{}/input'.format(2)
    cookie = config.COOKIE

    req = urllib.request.Request(url, headers={'Cookie': cookie})
    with urllib.request.urlopen(req) as f:
        # return list(map(lambda x: str(x, 'utf-8'), f.read().splitlines()))
        return f.read().splitlines()

class Day2(unittest.TestCase):
    @classmethod
    def setUp(inst):
        inst.inputList = getRealInput()

    def test_calculate_checksum(self):
        """
        Finds total # of strings with exacty two or exactly three characters repeated
        and multiplies the two totals
        """
        # self.inputList = ['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']
        two_letter_count = 0
        three_letter_count = 0
        
        for line in self.inputList:
            has_two = False
            has_three = False
            for _, g in itertools.groupby(sorted(str(line, 'utf-8'))):
                total = len(list(g))
                if total == 2:
                    has_two = True
                if total == 3:
                    has_three = True
                if has_two and has_three:
                    break

            if has_two:
                two_letter_count+=1
            if has_three:
                three_letter_count+=1

        log.debug('two letter count: {}'.format(two_letter_count))
        log.debug('three letter count: {}'.format(three_letter_count))
        checksum = two_letter_count * three_letter_count
        log.debug('checksum: {}'.format(checksum))
        self.assertEqual(5928, checksum)


    def test_similar_ids(self):
        """
        finds the first two ids that differ by as most one letter in the same position
        and remembers the common letters
        """
        # self.inputList = ['abcde','fghij','klmno','pqrst','fguij','axcye','wvxyz']
        max_len = len(self.inputList[0])
        common_letters = None
        for x in range(max_len):
            for k,g in itertools.groupby(sorted(map(lambda id: id[0:x] + id[x+1:max_len], self.inputList))):
                if len(list(g)) > 1:
                    common_letters = str(k, 'utf-8')
                    break
            if common_letters != None:
                break
        log.debug('common letters: {}'.format(common_letters))
        self.assertEqual('bqlporuexkwzyabnmgjqctvfs', common_letters)
        
        
if __name__ == '__main__':
    unittest.main()