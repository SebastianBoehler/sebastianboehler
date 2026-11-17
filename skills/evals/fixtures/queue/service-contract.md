# Queue service contract

`take_batch(records, limit)` accepts a list of records and a positive integer limit. It returns two
lists in order, the first containing at most `limit` records and the second containing all remaining
records. Both lists preserve input order. The caller retains its original list. Empty input returns
two empty lists. A zero or negative limit raises `ValueError` because the caller cannot make progress.

The existing public signature accepts a positional or keyword limit and supports omitting it.
