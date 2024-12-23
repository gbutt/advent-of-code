import config
import itertools
import logging
import unittest
import urllib.request

log = logging.getLogger(__name__)

class Day1(unittest.TestCase):
    @classmethod
    def setUp(inst):
        # read a file called test_day1.txt
        # the file contains two columns of numbers separated by whitespace
        # parse the columns into two lists
        list1 = []
        list2 = []
        with open('tests/test_day1.txt', mode='r',) as f:
            for input in f.read().splitlines():
                firstNumber, secondNumber = input.split()
                list1.append(int(firstNumber))
                list2.append(int(secondNumber))

        # sort the lists
        list1.sort()
        list2.sort()

        # assign the lists to inst.input
        inst.input = [list1, list2]

    def test_part1(self):
        list1, list2 = self.input
        # calculate the absolute difference between each pair in list1 and list2
        # add it to the total distance
        distance = 0
        for firstNumber, secondNumber in zip(list1, list2):
            distance += abs(firstNumber - secondNumber)
        log.debug('total distance: {}'.format(distance))

    def test_part2(self):
        list1, list2 = self.input
        # find the intersection of the two lists
        intersection = set(list1) & set(list2)
        # count the number of times each number in the intersection appears in list2 
        # multiply this count by the number itself and add it to the similarity score
        similarityScore = 0
        for number in intersection:
            similarityScore += list2.count(number) * number
        
        log.debug('similarity score: {}'.format(similarityScore))

        
if __name__ == '__main__':
    unittest.main()
