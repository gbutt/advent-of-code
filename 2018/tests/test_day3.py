import config
import itertools
import logging
import pytest
import unittest
import urllib.request

log = logging.getLogger(__name__)

def getRealInput():
    url = 'https://adventofcode.com/2018/day/{}/input'.format(3)
    cookie = config.COOKIE

    req = urllib.request.Request(url, headers={'Cookie': cookie})
    with urllib.request.urlopen(req) as f:
        return list(map(lambda x: str(x, 'utf-8'), f.read().splitlines()))
        # return f.read().splitlines()

class Rectangle(object):
    def __init__(self, min_x, min_y, max_x,max_y, id=None):
        self.id = id
        self.min_x = min_x
        self.min_y = min_y
        self.max_x = max_x
        self.max_y = max_y
    def is_real(self):
        return self.min_x <= self.max_x and self.min_y <= self.max_y

def between(pos, lower, upper):
    return lower <= pos and pos <= upper

def overlap(rect1, rect2):
    overlap_rect = get_overlapping_coordinates(rect1, rect2)
    return overlap_rect.is_real()

def get_overlapping_coordinates(rect1, rect2):
    return Rectangle(
        min_x=max(rect1.min_x, rect2.min_x)
        ,min_y=max(rect1.min_y, rect2.min_y)
        ,max_x=min(rect1.max_x, rect2.max_x)
        ,max_y=min(rect1.max_y, rect2.max_y)
    )

def unpack_coordinates(rect1):
    coords = set()
    for pair in itertools.product( \
            tuple(range(rect1.min_x, rect1.max_x+1)), \
            tuple(range(rect1.min_y, rect1.max_y+1))):
        coords.add(pair)
    return coords

def parse_claims(inputList):
    claim_rectangles = {}
    for item in list(map(lambda x: x.split(' '), inputList)):
        claim = item[0]
        top_left = tuple(map(lambda x: int(x), item[2][:-1].split(',')))
        wh = tuple(map(lambda x: int(x), item[3].split('x')))
        bot_right = (top_left[0]+wh[0]-1, top_left[1]+wh[1]-1)
        claim_rectangles[claim] = Rectangle(
            min_x=top_left[0]
            ,min_y=top_left[1]
            ,max_x=bot_right[0]
            ,max_y=bot_right[1]
            ,id=claim)
    return claim_rectangles

class Day3(unittest.TestCase):
    @classmethod
    def setUp(inst):
        inst.inputList = getRealInput()

    def test_overlap(self):
        # does not overlap
        set0 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=3, min_y=1, max_x=6, max_y=2)
        )
        self.assertFalse(overlap(*set0))

        # overlaps on rec11 top right
        set1 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=3, min_y=1, max_x=6, max_y=4)
        )
        self.assertTrue(overlap(*set1))

        # overlaps on rect2 top left
        set2 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=2, min_y=4, max_x=4, max_y=4)
        )
        self.assertTrue(overlap(*set2))

        # overlaps on rect2 bot left
        set3 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=2, min_y=2, max_x=3, max_y=3)
        )
        self.assertTrue(overlap(*set3))

        # overlaps on rect2 top left
        set4 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=2, min_y=4, max_x=2, max_y=4)
        )
        self.assertTrue(overlap(*set4))

        # overlaps on rect2 top left
        set5 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=1, min_y=3, max_x=1, max_y=3)
        )
        self.assertTrue(overlap(*set5))

        # overlaps on rect2 top left
        set6 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=4, min_y=3, max_x=4, max_y=3)
        )
        self.assertTrue(overlap(*set6))

        # overlaps on rect2 top left
        set7 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=1, min_y=6, max_x=1, max_y=6)
        )
        self.assertTrue(overlap(*set7))

        # overlaps on rect2 top left
        set8 = (
            Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
            ,Rectangle(min_x=4, min_y=6, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set8))

        # overlaps on rect1 top left
        set9 = (
            Rectangle(min_x=2, min_y=4, max_x=2, max_y=4)
            ,Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set9))

        # overlaps on rect1 top left
        set10 = (
            Rectangle(min_x=1, min_y=3, max_x=1, max_y=3)
            ,Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set10))

        # overlaps on rect1 top left
        set11 = (
            Rectangle(min_x=4, min_y=3, max_x=4, max_y=3)
            ,Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set11))

        # overlaps on rect1 top left
        set12 = (
            Rectangle(min_x=1, min_y=6, max_x=1, max_y=6)
            ,Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set12))

        # overlaps on rect1 top left
        set13 = (
            Rectangle(min_x=4, min_y=6, max_x=4, max_y=6)
            ,Rectangle(min_x=1, min_y=3, max_x=4, max_y=6)
        )
        self.assertTrue(overlap(*set13))

    def test_unpack_coordinates(self):
        rect1 = Rectangle(min_x=3,min_y=3,max_x=4,max_y=4)
        coords = unpack_coordinates(rect1)
        self.assertSetEqual({(3,3), (3,4), (4,3), (4,4)}, coords)

    def test_overlapping_fabric(self):
        # pytest.skip()
        self.inputList = [      #........
            '#1 @ 1,3: 4x4'     #...2222.
            ,'#2 @ 3,1: 4x4'    #...2222.
            ,'#3 @ 5,5: 2x2'    #.11xx22.
            ,'#4 @ 2,4: 3x1'    #.1xxx22.
        ]                       #.111133.
                                #.111133.
                                #........
        claim_rectangles = parse_claims(self.inputList)

        log.debug('total claims: {}'.format(len(claim_rectangles)))
        # log.debug('claims: {}'.format(claim_rectangles))

        overlapping_coordinates = set()
        overlapping_claims_count = 0
        for claim_set in itertools.combinations(claim_rectangles.values(), 2):
            rect_overlap = get_overlapping_coordinates(claim_set[0], claim_set[1])
            if rect_overlap.is_real():
                overlapping_claims_count+=1
                overlapping_coordinates.update(unpack_coordinates(rect_overlap))
        total = len(overlapping_coordinates)
        log.debug('total overlapping claims: {}'.format(overlapping_claims_count))
        log.debug('total overlapping coordinates: {}'.format(total))
        # log.debug('overlapping coordinates: {}'.format(overlapping_coordinates))
        self.assertEqual(116920, total)

    def test_find_first_claim_without_overlap(self):
        # self.inputList = [      #........
        #     '#1 @ 1,3: 4x4'     #...2222.
        #     ,'#2 @ 3,1: 4x4'    #...2222.
        #     ,'#3 @ 5,5: 2x2'    #.11xx22.
        #     ,'#4 @ 2,4: 3x1'    #.1xxx22.
        # ]                       #.111133.
        #                         #.111133.
        #                         #........
        claim_rectangles = parse_claims(self.inputList)

        overlapping_claims = set()
        for claim_set in itertools.combinations(claim_rectangles.values(), 2):
            rect_overlap = get_overlapping_coordinates(claim_set[0], claim_set[1])
            if rect_overlap.is_real():
                overlapping_claims.add(claim_set[0].id)
                overlapping_claims.add(claim_set[1].id)
        
        all_claims = set().union(claim_rectangles.keys())
        no_overlap = all_claims.difference(overlapping_claims)
        # log.debug(all_claims)
        # log.debug(overlapping_claims)
        log.debug(no_overlap)

        # self.assertTrue('#3' in no_overlap)
        self.assertTrue('#382' in no_overlap)
        
if __name__ == '__main__':
    unittest.main()