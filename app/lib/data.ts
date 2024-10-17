import { VideoData, VideoDataStatus } from "../MainEditor"

export const sampleTranscripts = [[
    {
      end: 0.2,
      skip: false,
      word: "Okay.",
      index: 67,
      start: 0
    },
    {
      end: 2.3,
      skip: false,
      word: "Join,",
      index: 68,
      start: 1.8
    },
    {
      end: 2.8,
      skip: false,
      word: "Eureka",
      index: 69,
      start: 2.3
    },
    {
      end: 3,
      skip: false,
      word: "now",
      index: 70,
      start: 2.8
    },
    {
      end: 4,
      skip: false,
      word: "only",
      index: 71,
      start: 3
    },
    {
      end: 4.9,
      skip: false,
      word: "thousand",
      index: 72,
      start: 4
    },
    {
      end: 5.2,
      skip: false,
      word: "dollars",
      index: 73,
      start: 4.9
    },
    {
      end: 5.4,
      skip: false,
      word: "per",
      index: 74,
      start: 5.2
    },
    {
      end: 5.6,
      skip: false,
      word: "month.",
      index: 75,
      start: 5.4
    },
    {
      end: 7.6,
      skip: false,
      word: "That's",
      index: 76,
      start: 6.6
    },
    {
      end: 7.6,
      skip: false,
      word: "not",
      index: 77,
      start: 7.6
    },
    {
      end: 7.8,
      skip: false,
      word: "even",
      index: 78,
      start: 7.6
    },
    {
      end: 8.2,
      skip: false,
      word: "named",
      index: 79,
      start: 7.8
    },
    {
      end: 8.7,
      skip: false,
      word: "Eureka.",
      index: 80,
      start: 8.2
    }
  ], [
  {
      word: "the",
      start: 0.9,
      end: 1.4,
      skip: false,
      index: 7,
  },
  {
      word: "quick",
      start: 1.4,
      end: 1.9,
      skip: false,
      index: 8,
  },
  {
      word: "brown",
      start: 1.9,
      end: 2.1,
      skip: false,
      index: 9,
  },
  {
      word: "fox",
      start: 2.1,
      end: 2.6,
      skip: false,
      index: 10,
  },
  {
      word: "jumps",
      start: 2.6,
      end: 3.8,
      skip: false,
      index: 11,
  },
  {
      word: "over",
      start: 3.8,
      end: 4,
      skip: false,
      index: 12,
  },
  {
      word: "the",
      start: 4,
      end: 4.4,
      skip: false,
      index: 13,
  },
  {
      word: "lazy",
      start: 4.4,
      end: 4.6,
      skip: false,
      index: 14,
  },
  {
      word: "dog",
      start: 4.6,
      end: 5,
      skip: false,
      index: 15,
  },
  {
      word: "the",
      start: 7.5,
      end: 7.9,
      skip: false,
      index: 16,
  },
  {
      word: "quick",
      start: 7.9,
      end: 8.3,
      skip: false,
      index: 17,
  },
  {
      word: "brown",
      start: 8.3,
      end: 8.5,
      skip: false,
      index: 18,
  },
  {
      word: "fox",
      start: 8.5,
      end: 9,
      skip: false,
      index: 19,
  },
  {
      word: "jumps",
      start: 9,
      end: 10.1,
      skip: false,
      index: 20,
  },
  {
      word: "over",
      start: 10.1,
      end: 10.2,
      skip: false,
      index: 21,
  },
  {
      word: "the",
      start: 10.2,
      end: 10.7,
      skip: false,
      index: 22,
  },
  {
      word: "lazy",
      start: 10.7,
      end: 10.8,
      skip: false,
      index: 23,
  },
  {
      word: "dog",
      start: 10.8,
      end: 11.2,
      skip: false,
      index: 24,
  }
]]

export const videoNames = [
  "IMG_4170.mp4",
  "IMG_4171.mp4"
]

export const sampleTranscriptionResponse = [
  {
      "word": "people",
      "start": 0,
      "end": 0.4,
      "skip": false,
      "index": 0
  },
  {
      "word": "are",
      "start": 0.4,
      "end": 0.5,
      "skip": false,
      "index": 1
  },
  {
      "word": "finally",
      "start": 0.5,
      "end": 0.7,
      "skip": false,
      "index": 2
  },
  {
      "word": "starting",
      "start": 0.7,
      "end": 1,
      "skip": false,
      "index": 3
  },
  {
      "word": "to",
      "start": 1,
      "end": 1.2,
      "skip": false,
      "index": 4
  },
  {
      "word": "pay",
      "start": 1.2,
      "end": 1.3,
      "skip": false,
      "index": 5
  },
  {
      "word": "attention",
      "start": 1.3,
      "end": 1.5,
      "skip": false,
      "index": 6
  },
  {
      "word": "even",
      "start": 1.5,
      "end": 2.3,
      "skip": false,
      "index": 7
  },
  {
      "word": "after",
      "start": 2.3,
      "end": 2.6,
      "skip": false,
      "index": 8
  },
  {
      "word": "all",
      "start": 2.6,
      "end": 2.7,
      "skip": false,
      "index": 9
  },
  {
      "word": "this",
      "start": 2.7,
      "end": 2.9,
      "skip": false,
      "index": 10
  },
  {
      "word": "I",
      "start": 2.9,
      "end": 3.3,
      "skip": false,
      "index": 11
  },
  {
      "word": "still",
      "start": 3.3,
      "end": 3.5,
      "skip": false,
      "index": 12
  },
  {
      "word": "blame",
      "start": 3.5,
      "end": 3.7,
      "skip": false,
      "index": 13
  },
  {
      "word": "Ronald",
      "start": 3.7,
      "end": 4,
      "skip": false,
      "index": 14
  },
  {
      "word": "Reagan",
      "start": 4,
      "end": 4.3,
      "skip": false,
      "index": 15
  },
  {
      "word": "Nixon",
      "start": 4.3,
      "end": 5.3,
      "skip": false,
      "index": 16
  },
  {
      "word": "broke",
      "start": 5.3,
      "end": 5.5,
      "skip": false,
      "index": 17
  },
  {
      "word": "the",
      "start": 5.5,
      "end": 5.6,
      "skip": false,
      "index": 18
  },
  {
      "word": "old",
      "start": 5.6,
      "end": 5.8,
      "skip": false,
      "index": 19
  },
  {
      "word": "Republican",
      "start": 5.8,
      "end": 6.2,
      "skip": false,
      "index": 20
  },
  {
      "word": "party",
      "start": 6.2,
      "end": 6.6,
      "skip": false,
      "index": 21
  },
  {
      "word": "register",
      "start": 6.6,
      "end": 9.5,
      "skip": false,
      "index": 22
  },
  {
      "word": "to",
      "start": 9.5,
      "end": 9.6,
      "skip": false,
      "index": 23
  },
  {
      "word": "vote",
      "start": 9.6,
      "end": 9.7,
      "skip": false,
      "index": 24
  },
  {
      "word": "no",
      "start": 9.7,
      "end": 10.2,
      "skip": false,
      "index": 25
  },
  {
      "word": "vote",
      "start": 10.2,
      "end": 10.3,
      "skip": false,
      "index": 26
  },
  {
      "word": "take",
      "start": 10.3,
      "end": 10.9,
      "skip": false,
      "index": 27
  },
  {
      "word": "the",
      "start": 10.9,
      "end": 11,
      "skip": false,
      "index": 28
  },
  {
      "word": "time",
      "start": 11,
      "end": 11.3,
      "skip": false,
      "index": 29
  },
  {
      "word": "to",
      "start": 11.3,
      "end": 11.3,
      "skip": false,
      "index": 30
  },
  {
      "word": "vote",
      "start": 11.3,
      "end": 11.5,
      "skip": false,
      "index": 31
  },
  {
      "word": "telling",
      "start": 11.5,
      "end": 12.2,
      "skip": false,
      "index": 32
  },
  {
      "word": "people",
      "start": 12.2,
      "end": 12.4,
      "skip": false,
      "index": 33
  },
  {
      "word": "to",
      "start": 12.4,
      "end": 12.5,
      "skip": false,
      "index": 34
  },
  {
      "word": "vote",
      "start": 12.5,
      "end": 12.6,
      "skip": false,
      "index": 35
  },
  {
      "word": "explain",
      "start": 12.6,
      "end": 13.5,
      "skip": false,
      "index": 36
  },
  {
      "word": "the",
      "start": 13.5,
      "end": 13.5,
      "skip": false,
      "index": 37
  },
  {
      "word": "importance",
      "start": 13.5,
      "end": 13.8,
      "skip": false,
      "index": 38
  },
  {
      "word": "of",
      "start": 13.8,
      "end": 14,
      "skip": false,
      "index": 39
  },
  {
      "word": "voting",
      "start": 14,
      "end": 14.2,
      "skip": false,
      "index": 40
  },
  {
      "word": "is",
      "start": 14.2,
      "end": 24.9,
      "skip": false,
      "index": 41
  },
  {
      "word": "more",
      "start": 24.9,
      "end": 25.2,
      "skip": false,
      "index": 42
  },
  {
      "word": "than",
      "start": 25.2,
      "end": 25.3,
      "skip": false,
      "index": 43
  },
  {
      "word": "Trump",
      "start": 25.3,
      "end": 25.7,
      "skip": false,
      "index": 44
  },
  {
      "word": "and",
      "start": 25.7,
      "end": 27.7,
      "skip": false,
      "index": 45
  },
  {
      "word": "it",
      "start": 27.7,
      "end": 37,
      "skip": false,
      "index": 46
  },
  {
      "word": "also",
      "start": 37,
      "end": 37.1,
      "skip": false,
      "index": 47
  },
  {
      "word": "says",
      "start": 37.1,
      "end": 37.4,
      "skip": false,
      "index": 48
  },
  {
      "word": "the",
      "start": 37.4,
      "end": 37.5,
      "skip": false,
      "index": 49
  },
  {
      "word": "activation",
      "start": 37.5,
      "end": 37.9,
      "skip": false,
      "index": 50
  },
  {
      "word": "phrase",
      "start": 37.9,
      "end": 38.3,
      "skip": false,
      "index": 51
  },
  {
      "word": "to",
      "start": 38.3,
      "end": 38.4,
      "skip": false,
      "index": 52
  },
  {
      "word": "kick",
      "start": 38.4,
      "end": 38.6,
      "skip": false,
      "index": 53
  },
  {
      "word": "things",
      "start": 38.6,
      "end": 38.7,
      "skip": false,
      "index": 54
  },
  {
      "word": "off",
      "start": 38.7,
      "end": 38.9,
      "skip": false,
      "index": 55
  },
  {
      "word": "just",
      "start": 38.9,
      "end": 41.5,
      "skip": false,
      "index": 56
  },
  {
      "word": "for",
      "start": 41.5,
      "end": 41.8,
      "skip": false,
      "index": 57
  },
  {
      "word": "everyone's",
      "start": 41.8,
      "end": 42.1,
      "skip": false,
      "index": 58
  },
  {
      "word": "information",
      "start": 42.1,
      "end": 42.2,
      "skip": false,
      "index": 59
  },
  {
      "word": "so",
      "start": 42.2,
      "end": 43.6,
      "skip": false,
      "index": 60
  },
  {
      "word": "you",
      "start": 43.6,
      "end": 43.8,
      "skip": false,
      "index": 61
  },
  {
      "word": "know",
      "start": 43.8,
      "end": 44,
      "skip": false,
      "index": 62
  },
  {
      "word": "what",
      "start": 44,
      "end": 44.1,
      "skip": false,
      "index": 63
  },
  {
      "word": "you're",
      "start": 44.1,
      "end": 44.2,
      "skip": false,
      "index": 64
  },
  {
      "word": "dealing",
      "start": 44.2,
      "end": 44.3,
      "skip": false,
      "index": 65
  },
  {
      "word": "with",
      "start": 44.3,
      "end": 44.7,
      "skip": false,
      "index": 66
  }
]