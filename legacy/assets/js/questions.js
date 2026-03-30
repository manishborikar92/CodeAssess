// Complete Question Bank — 37 Programming Questions
// Section A (Q1–Q25) + Section B (Q26–Q37)

const QUESTIONS = [
  // ─────────────────────────── SECTION A ───────────────────────────
  {
    id: 1,
    title: "Chocolate Packets — Move Zeros to End",
    section: "A",
    topic: "Arrays / Two Pointer",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "Ravi works in a chocolate factory. Some packets on the conveyor belt are empty (marked as 0). The manager wants all empty packets moved to the end of the belt without changing the order of the filled packets.",
    statement: "Given an array of N integers (some may be 0), rearrange it so all zeros appear at the end while preserving the original relative order of all non-zero elements. The operation must be performed in-place without allocating extra space.",
    constraints: ["1 ≤ N ≤ 100000", "0 ≤ arr[i] ≤ 10000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the rearranged array as N space-separated integers on a single line.",
    sampleCases: [
      { input: "6\n4 0 5 0 1 9", output: "4 5 1 9 0 0", explanation: "Non-zero elements 4,5,1,9 preserve their order; both zeros move to the end." },
      { input: "5\n0 0 0 1 2", output: "1 2 0 0 0", explanation: "Three leading zeros shift to the end after all non-zero elements." }
    ],
    hiddenCases: [
      { input: "1\n0", output: "0" },
      { input: "1\n5", output: "5" },
      { input: "4\n1 2 3 4", output: "1 2 3 4" },
      { input: "4\n0 0 0 0", output: "0 0 0 0" },
      { input: "8\n0 1 0 3 12 0 0 7", output: "1 3 12 7 0 0 0 0" }
    ],
    hint: "Two-pointer technique: 'insertPos' starts at 0. Scan array with 'i'; whenever arr[i] != 0, place arr[i] at insertPos and increment insertPos. After the scan, fill remaining positions with 0.",
    starterCode: `# Move all zeros to the end while preserving order of non-zero elements
# Do NOT use extra space (in-place operation)

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here
    
    print(' '.join(map(str, arr)))

solve()`
  },
  {
    id: 2,
    title: "Second Largest Element",
    section: "A",
    topic: "Arrays / Linear Scan",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "Priya has recorded scores of N students. She needs the second highest score for a merit certificate (the top scorer already received the first prize).",
    statement: "Given an array of N integers, find the second largest distinct element. If no second largest exists (all elements are equal or only one distinct value exists), print -1.",
    constraints: ["2 ≤ N ≤ 100000", "1 ≤ arr[i] ≤ 1000000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the second largest element, or -1 if it does not exist.",
    sampleCases: [
      { input: "5\n10 5 20 8 20", output: "10", explanation: "Largest is 20; the second largest distinct value is 10." },
      { input: "4\n7 7 7 7", output: "-1", explanation: "All elements are equal — no second largest exists." }
    ],
    hiddenCases: [
      { input: "2\n1 2", output: "1" },
      { input: "2\n5 5", output: "-1" },
      { input: "6\n3 1 4 1 5 9", output: "5" },
      { input: "3\n100 200 300", output: "200" },
      { input: "5\n1000000 999999 999999 1 1", output: "999999" }
    ],
    hint: "Maintain two variables: largest and secondLargest (both initialised to -INF). Traverse array once. If arr[i] > largest: secondLargest = largest, largest = arr[i]. Else if arr[i] > secondLargest and arr[i] != largest: secondLargest = arr[i]. O(n) time, O(1) space — do NOT sort.",
    starterCode: `# Find the second largest distinct element in the array
# Do NOT sort — use O(n) linear scan

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here
    
    # print the answer

solve()`
  },
  {
    id: 3,
    title: "Sort 0s, 1s and 2s — Color Flag",
    section: "A",
    topic: "Arrays / Dutch National Flag",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A gardener has a row of flowers that are either red (0), white (1), or blue (2). She wants them sorted by color — all red first, then white, then blue — in a single pass without using any sorting library.",
    statement: "Given an array containing only the values 0, 1, and 2, sort it in ascending order in O(n) time and O(1) extra space. You must NOT use any built-in sort function.",
    constraints: ["1 ≤ N ≤ 100000", "arr[i] is 0, 1, or 2 only"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers (each 0, 1, or 2)",
    outputFormat: "Print the sorted array as N space-separated integers.",
    sampleCases: [
      { input: "7\n2 0 1 1 0 2 1", output: "0 0 1 1 1 2 2", explanation: "All 0s first, then 1s, then 2s." },
      { input: "4\n1 2 0 1", output: "0 1 1 2" }
    ],
    hiddenCases: [
      { input: "1\n0", output: "0" },
      { input: "3\n2 2 2", output: "2 2 2" },
      { input: "3\n0 0 0", output: "0 0 0" },
      { input: "5\n2 1 0 2 1", output: "0 1 1 2 2" },
      { input: "6\n1 0 2 1 0 2", output: "0 0 1 1 2 2" }
    ],
    hint: "Dutch National Flag algorithm: three pointers — low=0, mid=0, high=N-1. While mid<=high: if arr[mid]==0 swap(arr[low],arr[mid]), low++, mid++; if arr[mid]==1 mid++; if arr[mid]==2 swap(arr[mid],arr[high]), high--.",
    starterCode: `# Sort array of 0s, 1s, 2s using Dutch National Flag algorithm
# Do NOT use any built-in sort function

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here (three-pointer approach)
    
    print(' '.join(map(str, arr)))

solve()`
  },
  {
    id: 4,
    title: "Missing Roll Number",
    section: "A",
    topic: "Arrays / Math",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A teacher has roll numbers 1 to N for a class of N students. During attendance one roll number is missing from the register. Find it quickly without sorting.",
    statement: "Given an array of N-1 distinct integers, each in the range [1, N], find the single missing integer.",
    constraints: ["2 ≤ N ≤ 100000", "1 ≤ arr[i] ≤ N", "All values are distinct"],
    inputFormat: "Line 1: integer N\nLine 2: N-1 space-separated integers",
    outputFormat: "Print the single missing integer on one line.",
    sampleCases: [
      { input: "5\n1 2 4 5", output: "3", explanation: "Expected sum = 15; actual sum = 12; missing = 15 - 12 = 3." },
      { input: "6\n6 3 4 1 5", output: "2" }
    ],
    hiddenCases: [
      { input: "2\n1", output: "2" },
      { input: "2\n2", output: "1" },
      { input: "10\n1 2 3 4 5 6 7 8 9", output: "10" },
      { input: "10\n2 3 4 5 6 7 8 9 10", output: "1" },
      { input: "7\n3 7 1 2 6 4", output: "5" }
    ],
    hint: "Formula approach: Missing = N*(N+1)/2 - sum(array). No sorting, no HashMap needed. O(n) time, O(1) space.",
    starterCode: `# Find the single missing number in range [1, N]
# Use the sum formula — O(n) time, O(1) space

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here
    
    # print the missing number

solve()`
  },
  {
    id: 5,
    title: "Rotate the Regiment — Array Rotation",
    section: "A",
    topic: "Arrays / Reversal Algorithm",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A commander orders his regiment of N soldiers to rotate their positions K steps to the right. Help him visualise the new formation.",
    statement: "Given an array of N integers and a value K, rotate the array to the right by K positions. If K >= N, use effective rotation K = K % N.",
    constraints: ["1 ≤ N ≤ 100000", "0 ≤ K ≤ 100000", "-10000 ≤ arr[i] ≤ 10000"],
    inputFormat: "Line 1: two integers N and K separated by a space\nLine 2: N space-separated integers",
    outputFormat: "Print the rotated array as N space-separated integers.",
    sampleCases: [
      { input: "7 3\n1 2 3 4 5 6 7", output: "5 6 7 1 2 3 4", explanation: "After 3 right rotations the last 3 elements come to the front." },
      { input: "5 7\n1 2 3 4 5", output: "4 5 1 2 3", explanation: "K=7; effective rotation = 7 % 5 = 2." }
    ],
    hiddenCases: [
      { input: "5 0\n1 2 3 4 5", output: "1 2 3 4 5" },
      { input: "5 5\n1 2 3 4 5", output: "1 2 3 4 5" },
      { input: "3 1\n1 2 3", output: "3 1 2" },
      { input: "4 2\n-1 -2 -3 -4", output: "-3 -4 -1 -2" },
      { input: "6 100\n1 2 3 4 5 6", output: "3 4 5 6 1 2" }
    ],
    hint: "Reversal method (O(n) time, O(1) space): Step 1 — reverse entire array. Step 2 — reverse first K elements. Step 3 — reverse remaining N-K elements.",
    starterCode: `# Rotate array to the right by K positions
# Use the reversal algorithm — O(n) time, O(1) space

def solve():
    line1 = input().split()
    n, k = int(line1[0]), int(line1[1])
    arr = list(map(int, input().split()))
    
    # Write your solution here
    # Remember: k = k % n to handle k >= n
    
    print(' '.join(map(str, arr)))

solve()`
  },
  {
    id: 6,
    title: "Split Array with Equal Averages",
    section: "A",
    topic: "Arrays / Prefix Sum",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A logistics manager wants to split a shipment into two consecutive groups so that both groups have the same average weight. Determine if such a split point exists.",
    statement: "Given an array of N integers, determine whether there exists an index i (1 ≤ i ≤ N-1) such that the average of arr[0..i-1] equals the average of arr[i..N-1]. Print YES or NO.",
    constraints: ["2 ≤ N ≤ 100000", "1 ≤ arr[i] ≤ 10000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print YES if a valid split exists, otherwise NO.",
    sampleCases: [
      { input: "5\n3 1 2 6 3", output: "YES", explanation: "Split at index 4: left=[3,1,2,6] avg=3.0; right=[3] avg=3.0. Equal!" },
      { input: "3\n1 2 4", output: "NO", explanation: "No valid split point gives equal averages." }
    ],
    hiddenCases: [
      { input: "2\n5 5", output: "YES" },
      { input: "2\n1 2", output: "NO" },
      { input: "4\n2 2 2 2", output: "YES" },
      { input: "6\n1 2 3 4 5 6", output: "NO" },
      { input: "4\n1 3 2 4", output: "YES" }
    ],
    hint: "For each split point i (1 to N-1): leftSum = prefix[i], rightSum = totalSum - leftSum. Check leftSum*(N-i) == rightSum*i (cross-multiply to avoid float division). Track leftSum incrementally.",
    starterCode: `# Determine if there's a split point where both halves have equal averages
# Use cross-multiplication to avoid floating point errors

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here
    # Tip: Check leftSum * rightLen == rightSum * leftLen
    
    # print YES or NO

solve()`
  },
  {
    id: 7,
    title: "Hotel Guest Counter — Peak Occupancy",
    section: "A",
    topic: "Arrays / Greedy / Sorting",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A hotel manager has check-in and check-out records of guests and wants to know the peak occupancy — the maximum number of guests ever present simultaneously.",
    statement: "Given two arrays entry[] and exit[] of size N (integer times), find the maximum number of guests present at any single moment. A guest at time T is present if entry[i] ≤ T ≤ exit[i].",
    constraints: ["1 ≤ N ≤ 100000", "1 ≤ entry[i] ≤ exit[i] ≤ 100000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated entry times\nLine 3: N space-separated exit times",
    outputFormat: "Print a single integer — the maximum simultaneous guest count.",
    sampleCases: [
      { input: "3\n1 2 9\n5 5 12", output: "2", explanation: "At times 2 to 5 guests 1 and 2 are both present simultaneously. Max = 2." },
      { input: "4\n1 3 5 7\n2 4 6 8", output: "1", explanation: "No two guests overlap." }
    ],
    hiddenCases: [
      { input: "1\n5\n10", output: "1" },
      { input: "3\n1 1 1\n10 10 10", output: "3" },
      { input: "5\n1 2 3 4 5\n10 10 10 10 10", output: "5" },
      { input: "4\n1 2 3 5\n4 6 8 9", output: "3" }
    ],
    hint: "Sort both arrays. Two-pointer scan: i=0, j=0, count=0, max=0. While i<N: if entry[i] <= exit[j] then count++, max=max(max,count), i++; else count--, j++. Return max.",
    starterCode: `# Find peak hotel occupancy using sorted entry/exit times

def solve():
    n = int(input())
    entry = list(map(int, input().split()))
    exit_ = list(map(int, input().split()))
    
    # Write your solution here (sort both arrays, use two pointers)
    
    # print the maximum simultaneous guest count

solve()`
  },
  {
    id: 8,
    title: "Palindrome Password Check",
    section: "A",
    topic: "Strings / Two Pointer",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A cybersecurity tool must flag passwords that read the same forwards and backwards — palindrome passwords are trivially guessable and must be rejected.",
    statement: "Given a string S, determine whether it is a palindrome (case-insensitive). Print YES if it is a palindrome, else NO.",
    constraints: ["1 ≤ |S| ≤ 100000", "S contains only English alphabets (upper and/or lower case)"],
    inputFormat: "A single line containing the string S",
    outputFormat: "Print YES or NO on a single line.",
    sampleCases: [
      { input: "RaceCar", output: "YES", explanation: "Lowercased: 'racecar' — reads the same forwards and backwards." },
      { input: "Hello", output: "NO", explanation: "'hello' reversed is 'olleh', which differs." }
    ],
    hiddenCases: [
      { input: "A", output: "YES" },
      { input: "Ab", output: "NO" },
      { input: "AaBbBbAa", output: "YES" },
      { input: "MadaM", output: "YES" },
      { input: "abcba", output: "YES" },
      { input: "abcde", output: "NO" }
    ],
    hint: "Two-pointer: left=0, right=|S|-1. Compare S[left].lower() with S[right].lower(). If any mismatch found, return NO. If loop completes without mismatch, return YES. O(n) time.",
    starterCode: `# Check if the string is a palindrome (case-insensitive)

def solve():
    s = input()
    
    # Write your solution here
    # Remember: case-insensitive comparison
    
    # print YES or NO

solve()`
  },
  {
    id: 9,
    title: "Anagram Detector",
    section: "A",
    topic: "Strings / Frequency Map",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "Two secret agents use anagram code words. Given two words, determine if one is a rearrangement of the other — meaning they use exactly the same letters with the same frequencies.",
    statement: "Given two strings A and B of the same length (all lowercase), check if A is an anagram of B. Print YES or NO. NOTE: Do NOT sort the strings — use a frequency map for an O(n) solution.",
    constraints: ["1 ≤ |A| = |B| ≤ 100000", "Both strings contain only lowercase English letters"],
    inputFormat: "Line 1: string A\nLine 2: string B",
    outputFormat: "Print YES or NO on a single line.",
    sampleCases: [
      { input: "listen\nsilent", output: "YES", explanation: "Both contain the letters e, i, l, n, s, t — same count." },
      { input: "hello\nworld", output: "NO", explanation: "Different character frequencies." }
    ],
    hiddenCases: [
      { input: "a\na", output: "YES" },
      { input: "a\nb", output: "NO" },
      { input: "aab\nbaa", output: "YES" },
      { input: "abc\ncab", output: "YES" },
      { input: "rat\ncar", output: "NO" },
      { input: "anagram\nnagaram", output: "YES" }
    ],
    hint: "Create an integer array freq[26] initialised to 0. For each character in A: freq[c-'a']++. For each character in B: freq[c-'a']--. If all values in freq are 0, output YES; otherwise NO.",
    starterCode: `# Check if two strings are anagrams using a frequency map
# Do NOT sort — use O(n) approach

def solve():
    a = input()
    b = input()
    
    # Write your solution here
    
    # print YES or NO

solve()`
  },
  {
    id: 10,
    title: "First Non-Repeating Character",
    section: "A",
    topic: "Strings / HashMap",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A data analyst processes log entries and needs the first unique character in a log string to serve as a transaction key. Help her find it quickly.",
    statement: "Given a string S of lowercase English letters, find and print the first character that does not repeat anywhere in S. If every character repeats, print -1.",
    constraints: ["1 ≤ |S| ≤ 100000", "S contains only lowercase English letters"],
    inputFormat: "A single line containing the string S",
    outputFormat: "Print the first non-repeating character, or -1 if none exists.",
    sampleCases: [
      { input: "aabbcde", output: "c", explanation: "'a' and 'b' both repeat. 'c' appears exactly once and appears before 'd' and 'e'." },
      { input: "aabb", output: "-1", explanation: "All characters repeat — no unique character exists." }
    ],
    hiddenCases: [
      { input: "z", output: "z" },
      { input: "aab", output: "b" },
      { input: "abcabc", output: "-1" },
      { input: "leetcode", output: "l" },
      { input: "loveleetcode", output: "v" }
    ],
    hint: "Pass 1: build a HashMap of character frequencies (or int[26] array). Pass 2: traverse string again; return the first character whose frequency equals 1.",
    starterCode: `# Find the first non-repeating character in the string

def solve():
    s = input()
    
    # Write your solution here
    # Two passes: 1) count frequencies, 2) find first with freq == 1
    
    # print the character or -1

solve()`
  },
  {
    id: 11,
    title: "Curtain Color Chunks — Max 'a' Count",
    section: "A",
    topic: "Strings / Substring",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "An interior designer considers one floor at a time (a chunk of L rooms). Each room is either aqua ('a') or beige ('b'). Find the floor with the most aqua rooms.",
    statement: "Given a string S of characters 'a' and 'b', and an integer L, divide S into consecutive chunks of length L (the last chunk may be shorter than L). Print the maximum count of 'a' across all chunks.",
    constraints: ["1 ≤ L ≤ |S| ≤ 100000", "S contains only 'a' and 'b'"],
    inputFormat: "Line 1: string S\nLine 2: integer L",
    outputFormat: "Print the maximum count of 'a' in any single chunk.",
    sampleCases: [
      { input: "aabbaab\n2", output: "2", explanation: "Chunks: 'aa'(2), 'bb'(0), 'aa'(2), 'b'(0). Maximum = 2." },
      { input: "aaabba\n3", output: "3", explanation: "Chunks: 'aaa'(3), 'bba'(1). Maximum = 3." }
    ],
    hiddenCases: [
      { input: "a\n1", output: "1" },
      { input: "bbbb\n2", output: "0" },
      { input: "aaaa\n4", output: "4" },
      { input: "ababab\n3", output: "2" },
      { input: "aabbaa\n2", output: "2" }
    ],
    hint: "Loop with step L: for i = 0, L, 2L, ... take slice S[i : i+L], count 'a' in it, update a running maximum. O(n) total.",
    starterCode: `# Find the maximum count of 'a' in any chunk of length L

def solve():
    s = input()
    l = int(input())
    
    # Write your solution here
    # Iterate through chunks of size L and count 'a'
    
    # print the maximum count

solve()`
  },
  {
    id: 12,
    title: "Reverse the Sentence",
    section: "A",
    topic: "Strings / Manipulation",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A telegram transmission reverses the order of words in a message. Write a decoder that restores the original word order while keeping each word's characters intact.",
    statement: "Given a sentence of words separated by single spaces (no leading/trailing spaces), reverse the order of the words. Each word's internal characters remain unchanged.",
    constraints: ["1 ≤ |S| ≤ 10000", "S contains only lowercase letters and single spaces", "No leading or trailing spaces"],
    inputFormat: "A single line containing the sentence",
    outputFormat: "Print the sentence with word order reversed on a single line.",
    sampleCases: [
      { input: "hello world how are you", output: "you are how world hello", explanation: "Word order is fully reversed." },
      { input: "coding assessment platform", output: "platform assessment coding" }
    ],
    hiddenCases: [
      { input: "single", output: "single" },
      { input: "a b", output: "b a" },
      { input: "one two three four five", output: "five four three two one" },
      { input: "the quick brown fox", output: "fox brown quick the" }
    ],
    hint: "Split string on spaces to get a list of words. Reverse the list. Join with a single space and print. In Python: print(' '.join(input().split()[::-1]))",
    starterCode: `# Reverse the order of words in the sentence
# Keep each word's characters intact

def solve():
    sentence = input()
    
    # Write your solution here
    
    # print the reversed sentence

solve()`
  },
  {
    id: 13,
    title: "Count Palindrome Numbers in Range",
    section: "A",
    topic: "Strings / Number Conversion",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A mathematician calls a number 'magical' if it reads the same forwards and backwards. Given a range [M, N], count all magical numbers within it.",
    statement: "Given two integers M and N (M ≤ N), count the total number of palindrome integers in the closed range [M, N].",
    constraints: ["0 ≤ M ≤ N ≤ 10000"],
    inputFormat: "A single line with two space-separated integers M and N",
    outputFormat: "Print the count of palindrome numbers in [M, N].",
    sampleCases: [
      { input: "1 50", output: "13", explanation: "Single digits 1–9 (9 palindromes) + 11, 22, 33, 44 (4 palindromes) = 13 total." },
      { input: "100 200", output: "10", explanation: "101, 111, 121, 131, 141, 151, 161, 171, 181, 191 — 10 palindromes." }
    ],
    hiddenCases: [
      { input: "0 9", output: "10" },
      { input: "10 99", output: "9" },
      { input: "1000 2000", output: "10" },
      { input: "5 5", output: "1" },
      { input: "0 0", output: "1" }
    ],
    hint: "For each number n in [M, N]: convert n to string s; check if s == s reversed (s[::-1] in Python). Increment counter when true.",
    starterCode: `# Count all palindrome numbers in the range [M, N]

def solve():
    m, n = map(int, input().split())
    
    # Write your solution here
    # Convert each number to string and check if it equals its reverse
    
    # print the count

solve()`
  },
  {
    id: 14,
    title: "Fibonacci Sequence — Nth Term",
    section: "A",
    topic: "Math / Recursion / DP",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A botanist notices that the number of petals on flowers follows the Fibonacci sequence. Given a position N, find the Nth Fibonacci number.",
    statement: "Given N, print the Nth Fibonacci number. The sequence starts: F(1) = 1, F(2) = 1, F(3) = 2, F(4) = 3, ... Use an iterative approach (not recursive) to avoid stack overflow.",
    constraints: ["1 ≤ N ≤ 50"],
    inputFormat: "A single integer N",
    outputFormat: "Print the Nth Fibonacci number.",
    sampleCases: [
      { input: "7", output: "13", explanation: "F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13." },
      { input: "1", output: "1" }
    ],
    hiddenCases: [
      { input: "2", output: "1" },
      { input: "10", output: "55" },
      { input: "20", output: "6765" },
      { input: "50", output: "12586269025" }
    ],
    hint: "Use iterative DP: a, b = 1, 1. For i in range(N-2): a, b = b, a+b. Return b. This is O(n) time, O(1) space.",
    starterCode: `# Find the Nth Fibonacci number iteratively
# F(1)=1, F(2)=1, F(3)=2, ...

def solve():
    n = int(input())
    
    # Write your solution here (iterative — do NOT recurse)
    
    # print the Nth Fibonacci number

solve()`
  },
  {
    id: 15,
    title: "Prime Number Check",
    section: "A",
    topic: "Math / Number Theory",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A cryptographer uses prime numbers for key generation. Quickly verify whether a given number is prime.",
    statement: "Given an integer N, determine whether it is prime. Print PRIME if it is, else NOT PRIME.",
    constraints: ["1 ≤ N ≤ 10^9"],
    inputFormat: "A single integer N",
    outputFormat: "Print PRIME or NOT PRIME.",
    sampleCases: [
      { input: "7", output: "PRIME" },
      { input: "12", output: "NOT PRIME" }
    ],
    hiddenCases: [
      { input: "1", output: "NOT PRIME" },
      { input: "2", output: "PRIME" },
      { input: "3", output: "PRIME" },
      { input: "4", output: "NOT PRIME" },
      { input: "999983", output: "PRIME" },
      { input: "1000000000", output: "NOT PRIME" }
    ],
    hint: "Check divisibility up to sqrt(N) only. If N < 2 return NOT PRIME. For i from 2 to sqrt(N): if N % i == 0 return NOT PRIME. Return PRIME otherwise. O(sqrt(n)).",
    starterCode: `# Check if N is a prime number
# Efficient O(sqrt(n)) solution required for large N

import math

def solve():
    n = int(input())
    
    # Write your solution here
    
    # print PRIME or NOT PRIME

solve()`
  },
  {
    id: 16,
    title: "Factorial of a Number",
    section: "A",
    topic: "Math / Iteration",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A combinatorics student frequently computes factorials for permutation problems. Write an efficient iterative solution.",
    statement: "Given an integer N, compute N! (N factorial). Print the result.",
    constraints: ["0 ≤ N ≤ 20"],
    inputFormat: "A single integer N",
    outputFormat: "Print N! as a single integer.",
    sampleCases: [
      { input: "5", output: "120", explanation: "5! = 5×4×3×2×1 = 120." },
      { input: "0", output: "1", explanation: "0! = 1 by definition." }
    ],
    hiddenCases: [
      { input: "1", output: "1" },
      { input: "10", output: "3628800" },
      { input: "15", output: "1307674368000" },
      { input: "20", output: "2432902008176640000" }
    ],
    hint: "Iterative: result = 1; for i in range(1, N+1): result *= i. Return result. O(n) time. Note: 0! = 1 is a special case.",
    starterCode: `# Compute N factorial iteratively

def solve():
    n = int(input())
    
    # Write your solution here
    # Remember: 0! = 1
    
    # print N!

solve()`
  },
  {
    id: 17,
    title: "Binary Search",
    section: "A",
    topic: "Arrays / Binary Search",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A librarian needs to quickly find a book number in a sorted catalogue. Implement binary search for O(log n) lookup.",
    statement: "Given a sorted array of N distinct integers and a target value T, return the index (0-based) of T in the array. If T is not found, print -1.",
    constraints: ["1 ≤ N ≤ 100000", "-10^9 ≤ arr[i], T ≤ 10^9", "Array is sorted in ascending order"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers (sorted)\nLine 3: integer T (target)",
    outputFormat: "Print the 0-based index of T, or -1 if not found.",
    sampleCases: [
      { input: "7\n1 3 5 7 9 11 13\n7", output: "3", explanation: "7 is at index 3." },
      { input: "5\n2 4 6 8 10\n5", output: "-1", explanation: "5 is not in the array." }
    ],
    hiddenCases: [
      { input: "1\n42\n42", output: "0" },
      { input: "1\n42\n99", output: "-1" },
      { input: "5\n1 2 3 4 5\n1", output: "0" },
      { input: "5\n1 2 3 4 5\n5", output: "4" },
      { input: "6\n-3 -1 0 2 5 8\n-1", output: "1" }
    ],
    hint: "Set low=0, high=N-1. While low<=high: mid = (low+high)//2. If arr[mid]==T return mid. If arr[mid]<T set low=mid+1 else set high=mid-1. Return -1 if loop ends without finding T.",
    starterCode: `# Implement binary search on a sorted array
# O(log n) solution required

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    t = int(input())
    
    # Write your binary search here
    
    # print the 0-based index, or -1

solve()`
  },
  {
    id: 18,
    title: "Pattern Printing — Right Triangle",
    section: "A",
    topic: "Loops / Pattern",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A drill instructor arranges recruits in a triangular formation — each row has one more recruit than the previous.",
    statement: "Given N, print a right-angled triangle pattern of stars where row i (1-indexed) contains exactly i stars.",
    constraints: ["1 ≤ N ≤ 50"],
    inputFormat: "A single integer N",
    outputFormat: "Print N lines; the i-th line has i stars separated by spaces.",
    sampleCases: [
      { input: "4", output: "*\n* *\n* * *\n* * * *" },
      { input: "2", output: "*\n* *" }
    ],
    hiddenCases: [
      { input: "1", output: "*" },
      { input: "5", output: "*\n* *\n* * *\n* * * *\n* * * * *" }
    ],
    hint: "Outer loop i from 1 to N: print ' '.join(['*']*i)",
    starterCode: `# Print a right-triangle star pattern of N rows
# Row i has i stars separated by spaces

def solve():
    n = int(input())
    
    # Write your solution here
    
solve()`
  },
  {
    id: 19,
    title: "Linked List Reversal (Array Simulation)",
    section: "A",
    topic: "Linked List / Simulation",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A data pipeline must reverse the order of records stored in a linked-list structure. Simulate the reversal using arrays.",
    statement: "Given N nodes of a linked list as space-separated values, print them in reverse order.",
    constraints: ["1 ≤ N ≤ 100000", "1 ≤ node_value ≤ 10000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the values in reversed order as N space-separated integers.",
    sampleCases: [
      { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
      { input: "3\n10 20 30", output: "30 20 10" }
    ],
    hiddenCases: [
      { input: "1\n42", output: "42" },
      { input: "2\n1 2", output: "2 1" },
      { input: "6\n100 200 300 400 500 600", output: "600 500 400 300 200 100" }
    ],
    hint: "Read values into an array, reverse it, print. Alternatively use two pointers to reverse in-place: swap arr[left] and arr[right] while left < right.",
    starterCode: `# Reverse the linked list (simulated as an array)

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here (reverse arr)
    
    print(' '.join(map(str, arr)))

solve()`
  },
  {
    id: 20,
    title: "Stack Push-Pop Simulation",
    section: "A",
    topic: "Stack / Simulation",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A cafeteria uses a stack of trays. Simulate PUSH and POP operations and report the final state of the stack.",
    statement: "Given Q operations (PUSH x or POP), simulate a stack. For each POP, print the popped value or 'EMPTY' if the stack is empty. After all operations, print the stack from top to bottom.",
    constraints: ["1 ≤ Q ≤ 1000", "1 ≤ x ≤ 10000"],
    inputFormat: "Line 1: integer Q\nNext Q lines: either 'PUSH x' or 'POP'",
    outputFormat: "For each POP print the popped value or EMPTY. After all ops, print the final stack top-to-bottom (one value per line), or print 'Stack is empty' if empty.",
    sampleCases: [
      { input: "5\nPUSH 3\nPUSH 7\nPOP\nPUSH 5\nPOP", output: "7\n5\n3" },
      { input: "2\nPOP\nPOP", output: "EMPTY\nEMPTY\nStack is empty" }
    ],
    hiddenCases: [
      { input: "3\nPUSH 1\nPUSH 2\nPUSH 3", output: "3\n2\n1" },
      { input: "4\nPUSH 10\nPOP\nPOP\nPUSH 20", output: "10\nEMPTY\n20" }
    ],
    hint: "Use a Python list as a stack: list.append(x) for PUSH, list.pop() for POP. After all operations, print the remaining elements in reverse (top first).",
    starterCode: `# Simulate push/pop operations on a stack

def solve():
    q = int(input())
    stack = []
    pop_outputs = []
    
    for _ in range(q):
        op = input().split()
        if op[0] == 'PUSH':
            # Write PUSH logic
            pass
        else:  # POP
            # Write POP logic
            pass
    
    # Print all pop results
    for val in pop_outputs:
        print(val)
    
    # Print final stack (top to bottom)
    if stack:
        for val in reversed(stack):
            print(val)
    else:
        print("Stack is empty")

solve()`
  },
  {
    id: 21,
    title: "Sum of Digits",
    section: "A",
    topic: "Math / Number Theory",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A bank uses digit-sum checks on account numbers. Keep summing the digits of a number until it reduces to a single digit.",
    statement: "Given a non-negative integer N, repeatedly sum its digits until you get a single-digit result. Print that single digit.",
    constraints: ["0 ≤ N ≤ 10^18"],
    inputFormat: "A single integer N",
    outputFormat: "Print the single-digit digital root.",
    sampleCases: [
      { input: "9875", output: "2", explanation: "9+8+7+5=29 → 2+9=11 → 1+1=2." },
      { input: "0", output: "0" }
    ],
    hiddenCases: [
      { input: "9", output: "9" },
      { input: "10", output: "1" },
      { input: "999", output: "9" },
      { input: "1000000000000000000", output: "1" },
      { input: "12345", output: "6" }
    ],
    hint: "Mathematical formula: if N==0 return 0; else return 1 + (N-1) % 9. OR loop: while N >= 10: N = sum of its digits.",
    starterCode: `# Find the digital root (repeatedly sum digits until single digit)

def solve():
    n = int(input())
    
    # Write your solution here
    # Tip: Digital root formula: 1 + (n-1) % 9 for n > 0
    
    # print the single-digit result

solve()`
  },
  {
    id: 22,
    title: "Jump Game — Reach the Last Pad",
    section: "A",
    topic: "Arrays / Greedy",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A frog is sitting on lily pad 0 in a pond. Each lily pad shows the maximum number of hops the frog can take from that pad. Can the frog reach the last lily pad?",
    statement: "Given an array of N non-negative integers where arr[i] is the maximum jumps from index i, determine if you can reach index N-1 starting from index 0. Print YES or NO.",
    constraints: ["1 ≤ N ≤ 100000", "0 ≤ arr[i] ≤ 100000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print YES if the last index is reachable, else NO.",
    sampleCases: [
      { input: "6\n2 3 1 1 4 0", output: "YES", explanation: "From 0 (jump 2) → index 2 → index 3 → index 4 → reaches index 5." },
      { input: "5\n3 2 1 0 4", output: "NO", explanation: "Index 3 always has value 0 and acts as a permanent block." }
    ],
    hiddenCases: [
      { input: "1\n0", output: "YES" },
      { input: "2\n0 1", output: "NO" },
      { input: "3\n1 0 0", output: "NO" },
      { input: "4\n3 0 0 0", output: "YES" },
      { input: "5\n2 0 0 0 0", output: "NO" }
    ],
    hint: "Greedy: maintain maxReach = 0. For each index i: if i > maxReach, return NO (stuck). Update maxReach = max(maxReach, i + arr[i]). If maxReach >= N-1, return YES.",
    starterCode: `# Determine if you can reach the last index
# Greedy approach — O(n) time

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your solution here
    # Track the furthest reachable index
    
    # print YES or NO

solve()`
  },
  {
    id: 23,
    title: "Inventory Manager — Word Frequency",
    section: "A",
    topic: "HashMap / Strings",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A warehouse manager receives a shipment report as a line of product names. She needs a frequency count of each product. Any report containing digits must be flagged as invalid.",
    statement: "Given a string of space-separated words, count and print the frequency of each unique word in their first-appearance order. If the input string contains any digit (0–9), print 'Invalid Input'.",
    constraints: ["1 ≤ total words ≤ 1000", "Each word contains only lowercase letters when valid"],
    inputFormat: "A single line of space-separated words",
    outputFormat: "If input has digits: print 'Invalid Input'. Otherwise print each word and its count in first-appearance order, one per line, formatted as: word: count",
    sampleCases: [
      { input: "apple mango apple banana mango apple", output: "apple: 3\nmango: 2\nbanana: 1", explanation: "Frequencies printed in order of first appearance." },
      { input: "box1 pen box", output: "Invalid Input", explanation: "Input contains the digit '1'." }
    ],
    hiddenCases: [
      { input: "a a a a", output: "a: 4" },
      { input: "x y z", output: "x: 1\ny: 1\nz: 1" },
      { input: "hello hello world", output: "hello: 2\nworld: 1" },
      { input: "test123", output: "Invalid Input" }
    ],
    hint: "First, scan the entire input for any digit character — if found, print Invalid Input and stop. Otherwise, use an OrderedDict (Python) or LinkedHashMap (Java) to map each word to its count while preserving insertion order.",
    starterCode: `# Count word frequencies, preserving first-appearance order
# Flag as Invalid Input if any digit is found

def solve():
    line = input()
    
    # Write your solution here
    # Check for digits first, then count frequencies
    
solve()`
  },
  {
    id: 24,
    title: "Weekly Exercise Tracker",
    section: "A",
    topic: "Arrays / Floating Point",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "Ananya logs her daily exercise duration in minutes for 7 consecutive days. She wants a weekly summary showing both total minutes and average daily duration.",
    statement: "Given exactly 7 integers representing daily exercise durations in minutes, compute and print: (1) total minutes, (2) average daily duration rounded to 2 decimal places.",
    constraints: ["1 ≤ duration[i] ≤ 1440", "Exactly 7 integers will be given"],
    inputFormat: "A single line with exactly 7 space-separated integers",
    outputFormat: "Line 1: Total: X minutes\nLine 2: Average: Y minutes/day   (Y rounded to 2 decimal places)",
    sampleCases: [
      { input: "30 45 60 20 50 40 35", output: "Total: 280 minutes\nAverage: 40.00 minutes/day", explanation: "Sum = 280; Average = 280 / 7 = 40.00." },
      { input: "60 60 60 60 60 60 61", output: "Total: 421 minutes\nAverage: 60.14 minutes/day", explanation: "421 / 7 = 60.142857... rounds to 60.14." }
    ],
    hiddenCases: [
      { input: "1 1 1 1 1 1 1", output: "Total: 7 minutes\nAverage: 1.00 minutes/day" },
      { input: "100 200 300 400 500 600 700", output: "Total: 2800 minutes\nAverage: 400.00 minutes/day" },
      { input: "10 20 30 40 50 60 71", output: "Total: 281 minutes\nAverage: 40.14 minutes/day" }
    ],
    hint: "Sum all 7 values. Divide by 7.0 for float. Use f'{avg:.2f}' to format with exactly 2 decimal places. Watch out: 280/7 = 40.0 must print as 40.00.",
    starterCode: `# Compute total and average exercise duration for 7 days
# Format average to exactly 2 decimal places

def solve():
    durations = list(map(int, input().split()))
    
    # Write your solution here
    
    # print Total: X minutes
    # print Average: Y minutes/day

solve()`
  },
  {
    id: 25,
    title: "All Permutations of a String",
    section: "A",
    topic: "Recursion / Backtracking",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A cryptographer needs all possible rearrangements of a secret code word to test a decryption algorithm. Print them all in lexicographic order.",
    statement: "Given a string S of distinct lowercase letters, print all permutations of S sorted in lexicographic (alphabetical) order, one per line.",
    constraints: ["1 ≤ |S| ≤ 8", "S contains only distinct lowercase letters"],
    inputFormat: "A single line containing string S",
    outputFormat: "All permutations, one per line, in lexicographic order.",
    sampleCases: [
      { input: "abc", output: "abc\nacb\nbac\nbca\ncab\ncba", explanation: "All 3! = 6 permutations of 'abc' in sorted order." },
      { input: "ab", output: "ab\nba", explanation: "2 permutations." }
    ],
    hiddenCases: [
      { input: "a", output: "a" },
      { input: "ba", output: "ab\nba" },
      { input: "cd", output: "cd\ndc" }
    ],
    hint: "Sort the string first. Use itertools.permutations or backtracking. Collect all results in a list, sort it, then print each. For |S| ≤ 8, at most 8! = 40,320 operations.",
    starterCode: `# Print all permutations of the string in lexicographic order
# Backtracking or itertools.permutations are both acceptable

def solve():
    s = input()
    
    # Write your solution here
    # Collect permutations, sort, then print each
    
solve()`
  },

  // ─────────────────────────── SECTION B ───────────────────────────
  {
    id: 26,
    title: "Sliding Window Maximum",
    section: "B",
    topic: "Arrays / Deque / Sliding Window",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A weather station records hourly temperatures. A scientist wants the peak temperature for every consecutive window of K hours throughout the day.",
    statement: "Given an array of N integers and window size K, print the maximum element for every contiguous subarray of size K. There are N-K+1 windows in total.",
    constraints: ["1 ≤ K ≤ N ≤ 100000", "-10000 ≤ arr[i] ≤ 10000"],
    inputFormat: "Line 1: two integers N and K separated by a space\nLine 2: N space-separated integers",
    outputFormat: "Print N-K+1 space-separated maximum values on a single line.",
    sampleCases: [
      { input: "8 3\n1 3 -1 -3 5 3 6 7", output: "3 3 5 5 6 7", explanation: "Windows of 3: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7." },
      { input: "5 2\n4 3 2 1 5", output: "4 3 2 5" }
    ],
    hiddenCases: [
      { input: "1 1\n7", output: "7" },
      { input: "5 5\n1 2 3 4 5", output: "5" },
      { input: "6 3\n-1 -2 -3 -4 -5 -6", output: "-1 -2 -3 -4" },
      { input: "4 2\n10 5 2 7", output: "10 5 7" }
    ],
    hint: "Use a deque of indices (decreasing order of values). For each element i: remove indices outside the window (< i-K+1) from front. Remove indices from back while arr[deque.back()] <= arr[i]. Add i to back. Record arr[deque.front()] for each window after processing first K elements.",
    starterCode: `# Find the maximum in every sliding window of size K
# Use a deque for O(n) solution

from collections import deque

def solve():
    line1 = input().split()
    n, k = int(line1[0]), int(line1[1])
    arr = list(map(int, input().split()))
    
    # Write your solution here (deque-based O(n) approach)
    
    # print the N-K+1 maximums separated by spaces

solve()`
  },
  {
    id: 27,
    title: "Detect Cycle in Linked List",
    section: "B",
    topic: "Linked List / Floyd's Algorithm",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A network engineer suspects a data packet is caught in a routing loop. Given the routing path as a linked list, determine whether a cycle exists.",
    statement: "You are given N node values and an integer P. The list is a singly linked list; the tail node points back to the node at index P (0-indexed), or has no next pointer if P = -1. Determine if a cycle exists. Print 'Cycle Detected' or 'No Cycle'.",
    constraints: ["1 ≤ N ≤ 100000", "-1 ≤ P < N"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated node values\nLine 3: integer P (tail connects to index P; -1 means no cycle)",
    outputFormat: "Print 'Cycle Detected' or 'No Cycle'.",
    sampleCases: [
      { input: "5\n1 2 3 4 5\n2", output: "Cycle Detected", explanation: "Tail node (5) connects back to index 2 (value 3), creating a cycle." },
      { input: "4\n1 2 3 4\n-1", output: "No Cycle", explanation: "Linear list with no back-pointer." }
    ],
    hiddenCases: [
      { input: "1\n1\n-1", output: "No Cycle" },
      { input: "1\n1\n0", output: "Cycle Detected" },
      { input: "3\n1 2 3\n0", output: "Cycle Detected" },
      { input: "5\n5 4 3 2 1\n-1", output: "No Cycle" }
    ],
    hint: "If P == -1, it's No Cycle immediately. Otherwise, Cycle Detected. (In the simulation, P != -1 always means a cycle since the tail always points back to some node.) Floyd's algorithm: slow and fast pointers — if they meet, cycle exists.",
    starterCode: `# Detect if a linked list contains a cycle
# P = -1 means no cycle; P >= 0 means tail connects to node at index P

def solve():
    n = int(input())
    values = list(map(int, input().split()))
    p = int(input())
    
    # Write your solution here
    # If P != -1, the list has a cycle; if P == -1, it does not
    
    # print 'Cycle Detected' or 'No Cycle'

solve()`
  },
  {
    id: 28,
    title: "Longest Common Subsequence",
    section: "B",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "Two students compared their study schedules (represented as strings). Find the length of the longest sequence of subject codes they both follow, in the same relative order.",
    statement: "Given two strings A and B, find the length of their Longest Common Subsequence (LCS). A subsequence preserves relative order but does not need to be contiguous.",
    constraints: ["1 ≤ |A|, |B| ≤ 1000", "Strings contain only lowercase letters"],
    inputFormat: "Line 1: string A\nLine 2: string B",
    outputFormat: "Print the length of the LCS as a single integer.",
    sampleCases: [
      { input: "abcde\nace", output: "3", explanation: "LCS is 'ace' (length 3)." },
      { input: "abc\nabc", output: "3", explanation: "LCS is 'abc' itself." }
    ],
    hiddenCases: [
      { input: "a\nb", output: "0" },
      { input: "a\na", output: "1" },
      { input: "abcdef\nfedcba", output: "1" },
      { input: "aggtab\ngxtxayb", output: "4" },
      { input: "mzjawxu\nxmjyauz", output: "4" }
    ],
    hint: "2D DP: dp[i][j] = LCS of A[0..i-1] and B[0..j-1]. If A[i-1]==B[j-1]: dp[i][j]=dp[i-1][j-1]+1. Else dp[i][j]=max(dp[i-1][j], dp[i][j-1]). Answer = dp[|A|][|B|].",
    starterCode: `# Find the length of the Longest Common Subsequence
# Use 2D Dynamic Programming

def solve():
    a = input()
    b = input()
    
    m, n = len(a), len(b)
    # dp[i][j] = LCS length of a[:i] and b[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Write your DP recurrence here
    
    print(dp[m][n])

solve()`
  },
  {
    id: 29,
    title: "Caesar Cipher Encryption",
    section: "B",
    topic: "Strings / ASCII Arithmetic",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A spy agency encodes messages by shifting every letter K positions forward in the alphabet (wrapping Z back to A). Encode the given message.",
    statement: "Given a string S of uppercase English letters and an integer K, encrypt S using Caesar Cipher: shift each character K positions forward, wrapping from Z back to A. Print the encrypted string.",
    constraints: ["1 ≤ |S| ≤ 100000", "S contains only uppercase English letters A–Z", "1 ≤ K ≤ 25"],
    inputFormat: "Line 1: string S\nLine 2: integer K",
    outputFormat: "Print the encrypted string (uppercase).",
    sampleCases: [
      { input: "HELLO\n3", output: "KHOOR", explanation: "H→K, E→H, L→O, L→O, O→R." },
      { input: "XYZ\n3", output: "ABC", explanation: "X→A, Y→B, Z→C (wrap-around applies)." }
    ],
    hiddenCases: [
      { input: "A\n1", output: "B" },
      { input: "Z\n1", output: "A" },
      { input: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\n13", output: "NOPQRSTUVWXYZABCDEFGHIJKLM" },
      { input: "ABC\n5", output: "FGH" }
    ],
    hint: "For each character c: encrypted_char = chr((ord(c) - ord('A') + K) % 26 + ord('A')). The modulo 26 handles the wrap-around from Z back to A automatically.",
    starterCode: `# Encrypt string using Caesar Cipher with shift K

def solve():
    s = input()
    k = int(input())
    
    # Write your solution here
    # Use: chr((ord(c) - ord('A') + k) % 26 + ord('A'))
    
    # print the encrypted string

solve()`
  },
  {
    id: 30,
    title: "Matrix Spiral Traversal",
    section: "B",
    topic: "2D Arrays / Simulation",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A printer needs to print all elements of a grid in clockwise spiral order — starting from the top-left corner and spiralling inward.",
    statement: "Given an M × N matrix of integers, print all elements in clockwise spiral order on a single line separated by spaces.",
    constraints: ["1 ≤ M, N ≤ 100", "-1000 ≤ matrix[i][j] ≤ 1000"],
    inputFormat: "Line 1: two integers M and N separated by a space\nNext M lines: N space-separated integers each",
    outputFormat: "Print all elements in clockwise spiral order on one line.",
    sampleCases: [
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "1 2 3 6 9 8 7 4 5", explanation: "Top row L→R, right col T→B, bottom row R→L, left col B→T, then inner." },
      { input: "2 4\n1 2 3 4\n5 6 7 8", output: "1 2 3 4 8 7 6 5" }
    ],
    hiddenCases: [
      { input: "1 1\n42", output: "42" },
      { input: "1 4\n1 2 3 4", output: "1 2 3 4" },
      { input: "4 1\n1\n2\n3\n4", output: "1 2 3 4" },
      { input: "2 2\n1 2\n3 4", output: "1 2 4 3" }
    ],
    hint: "Four boundary pointers: top=0, bottom=M-1, left=0, right=N-1. Traverse top row (left→right, top++); right col (top→bottom, right--); bottom row (right→left, bottom--); left col (bottom→top, left++). Repeat while top<=bottom and left<=right.",
    starterCode: `# Traverse matrix in clockwise spiral order
# Use four boundary pointers

def solve():
    line1 = input().split()
    m, n = int(line1[0]), int(line1[1])
    matrix = []
    for _ in range(m):
        matrix.append(list(map(int, input().split())))
    
    result = []
    top, bottom, left, right = 0, m - 1, 0, n - 1
    
    # Write your spiral traversal here
    
    print(' '.join(map(str, result)))

solve()`
  },
  {
    id: 31,
    title: "Trapping Rain Water",
    section: "B",
    topic: "Arrays / Two Pointer",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "After heavy rain, water collects between buildings of different heights. Given the building heights, calculate the total volume of rainwater trapped between them.",
    statement: "Given an array of N non-negative integers representing building heights, compute the total units of rainwater trapped after rain fills all gaps.",
    constraints: ["1 ≤ N ≤ 100000", "0 ≤ height[i] ≤ 10000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print a single integer: total units of water trapped.",
    sampleCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "6 units of water are trapped in the valleys." },
      { input: "6\n4 2 0 3 2 5", output: "9", explanation: "Total trapped water = 9 units." }
    ],
    hiddenCases: [
      { input: "1\n5", output: "0" },
      { input: "2\n3 4", output: "0" },
      { input: "3\n3 0 3", output: "3" },
      { input: "5\n0 0 0 0 0", output: "0" },
      { input: "5\n5 4 3 2 1", output: "0" }
    ],
    hint: "Two-pointer: left=0, right=N-1, leftMax=0, rightMax=0, result=0. While left < right: if height[left] <= height[right]: update leftMax or add leftMax-height[left] to result; left++. Else mirror logic from right. O(n), O(1).",
    starterCode: `# Calculate total rainwater trapped between buildings
# Two-pointer O(n) solution

def solve():
    n = int(input())
    height = list(map(int, input().split()))
    
    # Write your two-pointer solution here
    
    # print total water trapped

solve()`
  },
  {
    id: 32,
    title: "Maximum Subarray Sum — Kadane's Algorithm",
    section: "B",
    topic: "Arrays / Greedy / DP",
    difficulty: "Easy-Medium",
    maxScore: 100,
    scenario: "A stock trader wants to find the most profitable consecutive trading window. Given daily profit/loss values, find the maximum sum of any contiguous trading period.",
    statement: "Given an array of N integers (positive and/or negative), find the contiguous subarray with the largest sum and print that sum.",
    constraints: ["1 ≤ N ≤ 100000", "-10000 ≤ arr[i] ≤ 10000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the maximum subarray sum as a single integer.",
    sampleCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "Subarray [4, -1, 2, 1] has the maximum sum = 6." },
      { input: "5\n1 2 3 4 5", output: "15", explanation: "The entire array has the maximum sum." }
    ],
    hiddenCases: [
      { input: "1\n-5", output: "-5" },
      { input: "1\n5", output: "5" },
      { input: "4\n-1 -2 -3 -4", output: "-1" },
      { input: "6\n-2 -3 4 -1 -2 1", output: "4" },
      { input: "3\n5 -3 5", output: "7" }
    ],
    hint: "Kadane's: maxSoFar = maxEndingHere = arr[0]. For i from 1 to N-1: maxEndingHere = max(arr[i], maxEndingHere + arr[i]); maxSoFar = max(maxSoFar, maxEndingHere). Return maxSoFar.",
    starterCode: `# Find the maximum sum contiguous subarray using Kadane's Algorithm

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write Kadane's algorithm here
    # Handle the all-negative case correctly
    
    # print the maximum subarray sum

solve()`
  },
  {
    id: 33,
    title: "Valid Parentheses / Balanced Brackets",
    section: "B",
    topic: "Stack / String",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A compiler must verify that all brackets in source code are properly opened and closed in the correct nesting order. Build the bracket validator.",
    statement: "Given a string S containing only the characters (, ), {, }, [, ], determine if the brackets are balanced and properly nested. Print 'Valid' or 'Invalid'.",
    constraints: ["1 ≤ |S| ≤ 100000", "S contains only ( ) { } [ ]"],
    inputFormat: "A single line containing the bracket string S",
    outputFormat: "Print 'Valid' if brackets are balanced, else 'Invalid'.",
    sampleCases: [
      { input: "()[]{}", output: "Valid", explanation: "Each open bracket is closed by the matching closing bracket in correct order." },
      { input: "([)]", output: "Invalid", explanation: "'[' is closed by ')' before it is closed by ']' — incorrect nesting." }
    ],
    hiddenCases: [
      { input: "()", output: "Valid" },
      { input: "((", output: "Invalid" },
      { input: "))", output: "Invalid" },
      { input: "{[]}", output: "Valid" },
      { input: "({[]})", output: "Valid" },
      { input: "([{)]}", output: "Invalid" }
    ],
    hint: "Stack: for each character c: if c is an open bracket push it. If c is a closing bracket: if stack is empty or top doesn't match, return Invalid; else pop. At end: if stack is empty return Valid, else Invalid.",
    starterCode: `# Validate balanced brackets using a stack

def solve():
    s = input()
    stack = []
    matching = {')': '(', '}': '{', ']': '['}
    
    # Write your stack-based solution here
    
    # print 'Valid' or 'Invalid'

solve()`
  },
  {
    id: 34,
    title: "GCD of Array Elements",
    section: "B",
    topic: "Math / Euclidean Algorithm",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A factory has N machines that complete their cycles at different intervals. The GCD of all cycle times tells the factory how often all machines sync up simultaneously.",
    statement: "Given an array of N positive integers, find the GCD (Greatest Common Divisor) of all elements by applying the Euclidean algorithm iteratively.",
    constraints: ["1 ≤ N ≤ 100000", "1 ≤ arr[i] ≤ 1000000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the GCD of all array elements as a single integer.",
    sampleCases: [
      { input: "4\n12 18 24 36", output: "6", explanation: "GCD(12,18)=6; GCD(6,24)=6; GCD(6,36)=6." },
      { input: "3\n7 14 21", output: "7", explanation: "All three are divisible by 7." }
    ],
    hiddenCases: [
      { input: "1\n17", output: "17" },
      { input: "2\n8 12", output: "4" },
      { input: "3\n100 75 50", output: "25" },
      { input: "4\n1 2 3 4", output: "1" },
      { input: "3\n1000000 999999 999998", output: "1" }
    ],
    hint: "Euclidean GCD: gcd(a, b) = gcd(b, a % b) until b == 0. Apply iteratively: result = arr[0]; for i from 1 to N-1: result = gcd(result, arr[i]). Final result is the GCD of all elements.",
    starterCode: `# Find the GCD of all array elements using Euclidean algorithm

def gcd(a, b):
    # Write the Euclidean GCD function here
    pass

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    result = arr[0]
    for i in range(1, n):
        result = gcd(result, arr[i])
    
    print(result)

solve()`
  },
  {
    id: 35,
    title: "Coin Change — Minimum Coins",
    section: "B",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "An ATM holds coins of certain denominations. A customer wants to withdraw exactly Rs. T. Find the minimum number of coins needed, or report that it is impossible.",
    statement: "Given an array of coin denominations and a target amount T, find the minimum number of coins needed to make exactly T. If it is impossible, print -1.",
    constraints: ["1 ≤ number of denominations ≤ 12", "1 ≤ coin[i] ≤ 1000", "1 ≤ T ≤ 10000"],
    inputFormat: "Line 1: integer N (number of coin types)\nLine 2: N space-separated coin denominations\nLine 3: integer T (target amount)",
    outputFormat: "Print the minimum number of coins to make T, or -1 if impossible.",
    sampleCases: [
      { input: "3\n1 5 6\n11", output: "2", explanation: "6 + 5 = 11 using 2 coins." },
      { input: "3\n2 5 10\n3", output: "-1", explanation: "Impossible to make 3 using only {2, 5, 10}." }
    ],
    hiddenCases: [
      { input: "1\n1\n7", output: "7" },
      { input: "3\n1 2 5\n11", output: "3" },
      { input: "2\n3 7\n14", output: "2" },
      { input: "2\n3 7\n8", output: "-1" },
      { input: "1\n2\n3", output: "-1" }
    ],
    hint: "1D DP: dp[0]=0; dp[i]=infinity for i>0. For each amount i from 1 to T: for each coin c<=i: dp[i]=min(dp[i], dp[i-c]+1). If dp[T] is still infinity, print -1.",
    starterCode: `# Minimum coins to make target amount using Dynamic Programming

def solve():
    n = int(input())
    coins = list(map(int, input().split()))
    t = int(input())
    
    INF = float('inf')
    dp = [INF] * (t + 1)
    dp[0] = 0
    
    # Write your DP solution here
    
    print(-1 if dp[t] == INF else dp[t])

solve()`
  },
  {
    id: 36,
    title: "Bubble Sort — Descending Order",
    section: "B",
    topic: "Sorting / Implementation",
    difficulty: "Easy",
    maxScore: 100,
    scenario: "A leaderboard system needs players sorted by score from highest to lowest. Implement sorting manually — built-in sort functions are strictly not allowed.",
    statement: "Given an array of N integers, sort it in DESCENDING order using Bubble Sort. You must NOT use any built-in sorting function.",
    constraints: ["1 ≤ N ≤ 1000", "0 ≤ arr[i] ≤ 100000"],
    inputFormat: "Line 1: integer N\nLine 2: N space-separated integers",
    outputFormat: "Print the array sorted in descending order as N space-separated integers.",
    sampleCases: [
      { input: "5\n10 40 30 20 50", output: "50 40 30 20 10", explanation: "Sorted highest to lowest." },
      { input: "4\n5 5 3 1", output: "5 5 3 1", explanation: "Already in descending order." }
    ],
    hiddenCases: [
      { input: "1\n99", output: "99" },
      { input: "3\n1 2 3", output: "3 2 1" },
      { input: "5\n0 0 0 0 1", output: "1 0 0 0 0" },
      { input: "4\n100000 0 50000 25000", output: "100000 50000 25000 0" }
    ],
    hint: "Same as ascending Bubble Sort but change the swap condition: swap arr[j] and arr[j+1] when arr[j] < arr[j+1] (instead of >). This bubbles the largest values to the front.",
    starterCode: `# Sort array in DESCENDING order using Bubble Sort
# Do NOT use any built-in sort function

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    
    # Write your Bubble Sort (descending) here
    # Change the comparison direction compared to ascending sort
    
    print(' '.join(map(str, arr)))

solve()`
  },
  {
    id: 37,
    title: "BFS — Minimum Steps in Grid",
    section: "B",
    topic: "Graphs / Breadth-First Search",
    difficulty: "Medium",
    maxScore: 100,
    scenario: "A robot placed at the top-left corner of a grid must reach the bottom-right corner. Some cells are blocked. Moving through one open cell costs one step. Find the minimum steps required.",
    statement: "Given an M×N grid where 0 = open cell and 1 = blocked cell, find the minimum number of steps from cell (0,0) to cell (M-1, N-1) using BFS. Movement is allowed in 4 directions. If no path exists, print -1.",
    constraints: ["1 ≤ M, N ≤ 100", "Grid contains only 0s and 1s", "Start (0,0) and end (M-1, N-1) are guaranteed to be 0"],
    inputFormat: "Line 1: two integers M and N separated by a space\nNext M lines: N space-separated integers (0 or 1)",
    outputFormat: "Print the minimum number of steps, or -1 if unreachable.",
    sampleCases: [
      { input: "3 3\n0 0 0\n1 1 0\n1 1 0", output: "4", explanation: "Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) = 4 steps." },
      { input: "2 2\n0 1\n1 0", output: "-1", explanation: "All possible paths are blocked." }
    ],
    hiddenCases: [
      { input: "1 1\n0", output: "0" },
      { input: "1 3\n0 0 0", output: "2" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "4" },
      { input: "3 3\n0 1 0\n0 1 0\n0 0 0", output: "4" }
    ],
    hint: "BFS from (0,0): use a queue with entries (row, col, steps). Mark cells visited when enqueued. For each cell dequeued, check all 4 neighbours. Return steps when (M-1, N-1) is reached; return -1 if queue empties.",
    starterCode: `# Find minimum steps from top-left to bottom-right using BFS

from collections import deque

def solve():
    line1 = input().split()
    m, n = int(line1[0]), int(line1[1])
    grid = []
    for _ in range(m):
        grid.append(list(map(int, input().split())))
    
    if m == 1 and n == 1:
        print(0)
        return
    
    # Write your BFS solution here
    # Use a queue: (row, col, steps)
    # Mark visited cells
    
    # print minimum steps or -1

solve()`
  }
];

// Export for use in exam engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTIONS };
}
