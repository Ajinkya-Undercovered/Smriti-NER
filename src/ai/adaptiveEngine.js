// AI-Powered Dynamic Difficulty Adjustment (DDA) Engine
import { DIFFICULTY_LEVELS } from '../types/index.js';

export class AdaptiveDifficultyEngine {
  constructor() {
    // Latency threshold benchmarks in ms
    this.FAST_THRESHOLD = 3000;     // Under 3s = fast / high familiarity
    this.SLOW_THRESHOLD = 9000;     // Over 9s = hesitation / difficulty
    this.FATIGUE_THRESHOLD = 15000; // Over 15s = severe fatigue or disorientation
  }

  /**
   * Evaluates player performance in real time and calculates new difficulty state
   * @param {Object} metrics - { accuracy, averageLatencyMs, errorStreak, consecutiveMatches, currentLevel, sessionDurationSec }
   */
  evaluateDifficulty(metrics) {
    const { accuracy, averageLatencyMs, errorStreak, consecutiveMatches, currentLevel, sessionDurationSec } = metrics;
    let nextLevel = currentLevel;
    let reason = 'Difficulty sustained based on steady cognitive pace';
    let shouldOfferHint = false;
    let fatigueDetected = false;

    // Detect session fatigue (> 12 minutes continuous activity or severe latency slowdown)
    if (sessionDurationSec > 720 || averageLatencyMs > this.FATIGUE_THRESHOLD) {
      fatigueDetected = true;
      reason = 'Gentle rest suggested - Cognitive fatigue detected';
      // Step down difficulty to prevent agitation
      if (nextLevel > 1) nextLevel -= 1;
      shouldOfferHint = true;
      return { nextLevel, reason, shouldOfferHint, fatigueDetected };
    }

    // High error streak mitigation: compassionate intervention
    if (errorStreak >= 3) {
      shouldOfferHint = true;
      if (nextLevel > 1) {
        nextLevel -= 1;
        reason = 'Reduced complexity to maintain gentle encouragement and confidence';
      } else {
        reason = 'Providing visual highlight hint';
      }
      return { nextLevel, reason, shouldOfferHint, fatigueDetected };
    }

    // High performance progression: consecutive correct matches with fast latency
    if (consecutiveMatches >= 4 && accuracy >= 0.8 && averageLatencyMs < this.FAST_THRESHOLD) {
      if (nextLevel < 4) {
        nextLevel += 1;
        reason = 'Increased difficulty: Great memory recall and fast response time!';
      }
    } 
    // Medium performance: steady pace
    else if (averageLatencyMs > this.SLOW_THRESHOLD && accuracy < 0.6) {
      if (nextLevel > 1) {
        nextLevel -= 1;
        reason = 'Adjusted to more comfortable grid size';
      }
    }

    return { nextLevel, reason, shouldOfferHint, fatigueDetected };
  }

  /**
   * Calculates cognitive fluency score (0 to 100) based on accuracy, response speed, and calmness
   */
  calculateFluencyScore(accuracy, averageLatencyMs, moves, optimalMoves) {
    const accuracyFactor = Math.min(1, Math.max(0, accuracy)) * 50;
    
    // Latency factor: optimal is 2s-5s
    let latencyFactor = 30;
    if (averageLatencyMs < 4000) {
      latencyFactor = 30;
    } else if (averageLatencyMs < 8000) {
      latencyFactor = 22;
    } else if (averageLatencyMs < 12000) {
      latencyFactor = 15;
    } else {
      latencyFactor = 8;
    }

    // Move efficiency factor
    const moveEfficiency = optimalMoves > 0 ? Math.min(1, optimalMoves / Math.max(optimalMoves, moves)) * 20 : 15;

    return Math.round(accuracyFactor + latencyFactor + moveEfficiency);
  }
}

export const adaptiveEngine = new AdaptiveDifficultyEngine();
