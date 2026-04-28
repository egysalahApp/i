import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

// ═══════════════════════════════════════════
// إعدادات الصوت الافتراضية
// ═══════════════════════════════════════════
const VOLUMES = {
  bgm: {
    normal: 0.3,
    ducked: 0.05, // المستوى المنخفض أثناء تشغيل المؤثرات
  },
  sfx: 1.0,
};

const DUCKING_FADE_DUR = 300; // ملي ثانية (سرعة التلاشي)

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isBGMEnabled, setIsBGMEnabled] = useState(false);
  
  // ═══════════════════════════════════════════
  // مراجع الكائنات الصوتية (Howl Instances)
  // ═══════════════════════════════════════════
  const soundsRef = useRef({
    bgm: null,
    click: null,
    correct: null,
    wrong: null,
    complete: null
  });

  // متعقب لعدد المؤثرات التي تعمل حالياً للتعامل مع الـ Ducking
  const activeSfxCount = useRef(0);

  // ═══════════════════════════════════════════
  // التهيئة
  // ═══════════════════════════════════════════
  useEffect(() => {
    // تهيئة المؤثرات الصوتية
    soundsRef.current.click = new Howl({ src: ['/sounds/click.mp3'], volume: VOLUMES.sfx });
    soundsRef.current.correct = new Howl({ src: ['/sounds/correct.mp3'], volume: VOLUMES.sfx });
    soundsRef.current.wrong = new Howl({ src: ['/sounds/wrong.mp3'], volume: VOLUMES.sfx });
    soundsRef.current.complete = new Howl({ src: ['/sounds/complete.mp3'], volume: VOLUMES.sfx });

    // تهيئة الموسيقى الخلفية
    soundsRef.current.bgm = new Howl({
      src: ['/sounds/bgm/bgm-1.mp3'],
      loop: true,
      volume: VOLUMES.bgm.normal,
    });

    return () => {
      // تفريغ الذاكرة عند تدمير المكون
      Object.values(soundsRef.current).forEach(sound => {
        if (sound) sound.unload();
      });
    };
  }, []);

  // ═══════════════════════════════════════════
  // الـ Ducking (الخفض التلقائي للموسيقى)
  // ═══════════════════════════════════════════
  const duckBGM = () => {
    activeSfxCount.current += 1;
    if (soundsRef.current.bgm && isBGMEnabled && !isMuted) {
      // إذا كانت هذه أول حركة تخفيض، قم بتطبيق الـ Fade Down
      if (activeSfxCount.current === 1) {
        soundsRef.current.bgm.fade(VOLUMES.bgm.normal, VOLUMES.bgm.ducked, DUCKING_FADE_DUR);
      }
    }
  };

  const unduckBGM = () => {
    activeSfxCount.current = Math.max(0, activeSfxCount.current - 1);
    if (soundsRef.current.bgm && isBGMEnabled && !isMuted) {
      // إذا لم يعد هناك أي مؤثر يعمل، قم بإرجاع الصوت (Fade Up)
      if (activeSfxCount.current === 0) {
        soundsRef.current.bgm.fade(VOLUMES.bgm.ducked, VOLUMES.bgm.normal, DUCKING_FADE_DUR);
      }
    }
  };

  // ═══════════════════════════════════════════
  // التحكم في المؤثرات
  // ═══════════════════════════════════════════
  const playSfx = (soundKey, shouldDuck = true) => {
    const sound = soundsRef.current[soundKey];
    if (sound && !isMuted) {
      if (shouldDuck) {
        duckBGM();
        // إزالة مستمع الحدث القديم لمنع التكرار
        sound.off('end'); 
        sound.once('end', () => unduckBGM());
      }
      sound.play();
    }
  };

  const playClick = () => playSfx('click', false); // النقرة الخفيفة قد لا تحتاج إلى ducking
  const playCorrect = () => playSfx('correct', true);
  const playWrong = () => playSfx('wrong', true);
  const playComplete = () => playSfx('complete', true);

  // ═══════════════════════════════════════════
  // الكتم العام
  // ═══════════════════════════════════════════
  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      Howler.mute(newMuted); // كتم Howler بالكامل
      return newMuted;
    });
  };

  // ═══════════════════════════════════════════
  // التحكم في الموسيقى الخلفية
  // ═══════════════════════════════════════════
  const toggleBGM = () => {
    setIsBGMEnabled(prev => !prev);
  };

  useEffect(() => {
    if (!soundsRef.current.bgm) return;

    if (isBGMEnabled && !isMuted) {
      if (!soundsRef.current.bgm.playing()) {
        soundsRef.current.bgm.play();
        soundsRef.current.bgm.fade(0, VOLUMES.bgm.normal, 1000); // دخول ناعم
      }
    } else {
      // إيقاف ناعم بدلاً من الفصل المفاجئ
      soundsRef.current.bgm.fade(soundsRef.current.bgm.volume(), 0, 500);
      soundsRef.current.bgm.once('fade', () => {
        if (!isBGMEnabled || isMuted) {
          soundsRef.current.bgm.pause();
        }
      });
    }
  }, [isBGMEnabled, isMuted]);

  return (
    <SoundContext.Provider value={{ 
      isMuted, toggleMute, 
      isBGMEnabled, toggleBGM,
      playClick, playCorrect, playWrong, playComplete 
    }}>
      {children}
    </SoundContext.Provider>
  );
};
