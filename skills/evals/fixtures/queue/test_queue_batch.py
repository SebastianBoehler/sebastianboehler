import unittest

from queue_batch import take_batch


class QueueBatchTests(unittest.TestCase):
    def test_empty_input(self):
        self.assertEqual(take_batch([]), ([], []))

    def test_records_below_limit(self):
        self.assertEqual(take_batch(["a", "b"], limit=3), (["a", "b"], []))
