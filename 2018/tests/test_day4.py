# import config
import itertools
import logging
import pytest
import unittest
import re

# log = logging.getLogger(__name__)
# print = log.debug

def getRealInput():
    with open('tests/day{}_input.txt'.format(4), mode='r',) as f:
    # with new io.FileIO().read('day{}_input.txt'.format(4)) as f:
    #     # return list(map(lambda x: str(x, 'utf-8'), f.read().splitlines()))
        return f.readlines()

def getTestInput():
    return [
        '[1518-11-01 00:00] Guard #10 begins shift',
        '[1518-11-01 00:05] falls asleep',
        '[1518-11-01 23:58] Guard #99 begins shift',
        '[1518-11-01 00:25] wakes up',
        '[1518-11-01 00:30] falls asleep',
        '[1518-11-03 00:05] Guard #10 begins shift',
        '[1518-11-01 00:55] wakes up',
        '[1518-11-02 00:40] falls asleep',
        '[1518-11-04 00:02] Guard #99 begins shift',
        '[1518-11-02 00:50] wakes up',
        '[1518-11-03 00:24] falls asleep',
        '[1518-11-05 00:03] Guard #99 begins shift',
        '[1518-11-03 00:29] wakes up',
        '[1518-11-04 00:36] falls asleep',
        '[1518-11-04 00:46] wakes up',
        '[1518-11-05 00:45] falls asleep',
        '[1518-11-05 00:55] wakes up',
    ]

def sort_lines(input):
    return sorted(input)

class Day3(unittest.TestCase):
    def test_sort(self):
        inputList = getTestInput()
        sorted_input = sort_lines(inputList)
        # print('\n'.join(sorted_input))
        self.assertTrue(str(sorted_input[0]).startswith('[1518-11-01 00:00]'))
        self.assertTrue(sorted_input[1].startswith('[1518-11-01 00:05]'))
        self.assertTrue(sorted_input[2].startswith('[1518-11-01 00:25]'))
        self.assertTrue(sorted_input[3].startswith('[1518-11-01 00:30]'))
        self.assertTrue(sorted_input[4].startswith('[1518-11-01 00:55]'))
        self.assertTrue(sorted_input[5].startswith('[1518-11-01 23:58]'))
    
    def test_map_data(self):
        # sorted_input = sort_lines(getTestInput())
        sorted_input = sort_lines(getRealInput())
        prog = re.compile(r'^\[1518-\d{2}-\d{2} \d{2}\:(.*)\] (.*)$')

        guard = None
        sleep_start = None
        guard_map = dict()
        for line in sorted_input:
            result = prog.match(line)
            minute = int(result.group(1))
            value = result.group(2)
            if value.startswith('Guard'):
                guard = value.split(' ')[1]
                sleep_start = None
            elif value.startswith('falls asleep'):
                sleep_start = minute
            else:
                for i in range(sleep_start, minute):
                    dict_key = (guard,i)
                    current_val = guard_map.get(dict_key, 0)
                    guard_map[dict_key] = current_val + 1

        guard_sleep_minutes = dict()
        for guard,g in itertools.groupby(
                guard_map.items(), 
                key=lambda item: item[0][0]):
            total_minutes_asleep = guard_sleep_minutes.get(guard, 0)
            for item in g:
                total_minutes_asleep += item[1]
            guard_sleep_minutes[guard] = total_minutes_asleep

        guard_max = max(guard_sleep_minutes.items(), key=lambda item: item[1])[0]
        
        guard_max_minute = max(
            filter(
                lambda item: item[0][0] == guard_max,
                guard_map.items()),
            key=lambda item: item[1])
        print(guard_max_minute)
        self.assertEqual(38813, int(guard_max_minute[0][0][1:]) * guard_max_minute[0][1])

        guard_max_minute2 = max(
            guard_map.items(),
            key=lambda item: item[1]
        )
        print(guard_max_minute2)
        self.assertEqual(141071, int(guard_max_minute2[0][0][1:]) * guard_max_minute2[0][1])
        
        
if __name__ == '__main__':
    unittest.main()