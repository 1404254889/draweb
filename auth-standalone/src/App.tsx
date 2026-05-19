import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleCheckBig,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const COUNTRY_CODES = [
  { code: '+86', name: '中国' },
  { code: '+1', name: '美国' },
  { code: '+81', name: '日本' },
  { code: '+44', name: '英国' },
];

type AuthProvider = 'phone' | 'wechat' | 'apple';
type AuthStage = 'phone' | 'invite' | 'sms' | 'profile';
type PendingPolicyAction =
  | 'phone'
  | 'login'
  | { type: 'thirdParty'; provider: Exclude<AuthProvider, 'phone'> };

interface AuthResult {
  provider: AuthProvider;
  phoneLabel: string;
  nickname: string;
  bio: string;
  birthday: string;
  gender: string;
}

interface AuthFlowProps {
  onComplete: (result: AuthResult) => void;
  showToast: (message: string) => void;
}

function AuthFlow({ onComplete, showToast }: AuthFlowProps) {
  const [stage, setStage] = useState<AuthStage>('phone');
  const [provider, setProvider] = useState<AuthProvider>('phone');
  const [countryCode, setCountryCode] = useState('+86');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [checking, setChecking] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [hasAgreedPolicies, setHasAgreedPolicies] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isSmsBackDialogOpen, setIsSmsBackDialogOpen] = useState(false);
  const [pendingPolicyAction, setPendingPolicyAction] =
    useState<PendingPolicyAction | null>(null);
  const [smsRequestCount, setSmsRequestCount] = useState(0);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const maxDailySmsRequests = 10;
  const normalizedPhone = phone.replace(/\D/g, '');
  const canSubmitPhone = normalizedPhone.length === 11;
  const isDrUserPhone = normalizedPhone === '15112341263';
  const canSubmitInvite = inviteCode.trim().length > 0;
  const canLogin = codeSent && verificationCode.trim().length === 4;
  const canSubmitProfile = nickname.trim().length > 0 && birthday && gender;
  const isThirdPartyBinding = provider !== 'phone';
  const pageTitle =
    stage === 'profile'
      ? '填写资料'
      : stage === 'invite'
        ? '邀请码'
        : isThirdPartyBinding
          ? '绑定手机号'
          : '登录 / 注册';

  useEffect(() => {
    let timer: number | undefined;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (verificationCode.length === 4 && codeSent) {
      handleLoginSubmit();
    }
  }, [verificationCode, codeSent]);

  const requirePolicyAgreement = (action?: PendingPolicyAction) => {
    if (hasAgreedPolicies) return true;
    setPendingPolicyAction(action || null);
    setIsPolicyDialogOpen(true);
    return false;
  };

  const resetAuthForm = (nextProvider: AuthProvider = 'phone') => {
    setStage('phone');
    setProvider(nextProvider);
    setPhone('');
    setVerificationCode('');
    setInviteCode('');
    setCodeSent(false);
    setInviteError('');
    setCountdown(0);
    setIsCountryDropdownOpen(false);
  };

  const completeFlow = (result: AuthResult) => {
    showToast('认证流程已完成');
    window.setTimeout(() => {
      onComplete(result);
    }, 250);
  };

  const requestSmsCode = () => {
    if (smsRequestCount >= maxDailySmsRequests) {
      showToast('今日验证码请求次数已达上限');
      return;
    }
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      setVerificationCode('');
      setStage('sms');
      setCodeSent(true);
      setCountdown(60);
      setSmsRequestCount((prev) => prev + 1);
      showToast(`验证码已发送至 ${normalizedPhone}`);
    }, 450);
  };

  const continuePhoneSubmit = () => {
    if (!canSubmitPhone) return;
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      if (isDrUserPhone) {
        requestSmsCode();
      } else {
        setStage('invite');
        setCodeSent(false);
      }
    }, 450);
  };

  const continueThirdPartyLogin = (nextProvider: Exclude<AuthProvider, 'phone'>) => {
    if (nextProvider === 'apple') {
      completeFlow({
        provider: 'apple',
        phoneLabel: 'Apple 已授权登录',
        nickname: 'DR 用户',
        bio: '通过 Apple 登录进入认证完成态。',
        birthday: '未填写',
        gender: '未填写',
      });
      return;
    }

    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      resetAuthForm(nextProvider);
    }, 450);
  };

  const continuePendingPolicyAction = (action: PendingPolicyAction | null) => {
    if (!action) return;
    if (action === 'phone') {
      continuePhoneSubmit();
      return;
    }
    if (action === 'login') {
      if (canLogin) setStage('profile');
      return;
    }
    continueThirdPartyLogin(action.provider);
  };

  const handlePhoneSubmit = () => {
    if (!requirePolicyAgreement('phone')) return;
    continuePhoneSubmit();
  };

  const handleInviteSubmit = () => {
    if (!canSubmitInvite || inviteCode.trim() !== '332233') {
      setInviteError('邀请码错误');
      return;
    }
    setInviteError('');
    requestSmsCode();
  };

  const handleLoginSubmit = () => {
    if (!requirePolicyAgreement('login')) return;
    if (!canLogin) return;
    setStage('profile');
  };

  const handleProfileSubmit = () => {
    if (!canSubmitProfile) return;
    completeFlow({
      provider,
      phoneLabel: `${countryCode} ${normalizedPhone || '未填写'}`,
      nickname,
      bio: bio || '未填写简介',
      birthday,
      gender,
    });
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (!digits) {
      const nextCode = verificationCode.split('');
      nextCode[index] = '';
      setVerificationCode(nextCode.join('').slice(0, 4));
      return;
    }

    const nextCode = verificationCode.split('');
    digits.split('').forEach((digit, offset) => {
      if (index + offset < 4) {
        nextCode[index + offset] = digit;
      }
    });
    const normalizedCode = Array.from({ length: 4 }, (_, i) => nextCode[i] || '').join('');
    setVerificationCode(normalizedCode);
    const nextIndex = Math.min(index + digits.length, 3);
    codeInputRefs.current[nextIndex]?.focus();
  };

  const handleVerificationCodeKeyDown = (index: number, key: string) => {
    if (key !== 'Backspace' || verificationCode[index]) return;
    codeInputRefs.current[index - 1]?.focus();
  };

  const handleThirdPartyLogin = (nextProvider: Exclude<AuthProvider, 'phone'>) => {
    if (!requirePolicyAgreement({ type: 'thirdParty', provider: nextProvider })) return;
    continueThirdPartyLogin(nextProvider);
  };

  return (
    <section className="relative flex h-full flex-col overflow-y-auto bg-dark p-6 md:p-8 no-scrollbar">
      <div className="mb-8 space-y-4 pt-2">
        <div className="flex items-center justify-start">
          {(stage === 'invite' || stage === 'sms' || stage === 'profile') ? (
            <button
              onClick={() => {
                if (stage === 'sms') {
                  setIsSmsBackDialogOpen(true);
                  return;
                }
                if (stage === 'profile') {
                  setStage('phone');
                  return;
                }
                setStage('phone');
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition-transform active:scale-95"
              aria-label="返回"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="h-11" />
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold leading-tight text-white">{pageTitle}</h1>
          {stage === 'phone' && provider === 'phone' && (
            <p className="text-sm font-bold text-white/35">首次登录会自动创建新账号</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {stage === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/30">手机号</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                      className="flex h-14 w-24 items-center justify-between gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20"
                    >
                      {countryCode}
                      <ChevronDown size={16} />
                    </button>
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-16 z-20 max-h-60 w-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#1b1b1b] p-2 shadow-2xl">
                        {COUNTRY_CODES.map((item) => (
                          <button
                            key={item.code}
                            onClick={() => {
                              setCountryCode(item.code);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-white hover:bg-white/10"
                          >
                            <span>{item.name}</span>
                            <span className="opacity-60">{item.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setInviteCode('');
                      setInviteError('');
                      setVerificationCode('');
                      setCodeSent(false);
                    }}
                    inputMode="tel"
                    placeholder="请输入手机号"
                    className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={!canSubmitPhone || checking}
                className="h-14 w-full rounded-2xl bg-white font-black text-dark shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
              >
                获取验证码
              </button>

              <button
                onClick={() => setHasAgreedPolicies((prev) => !prev)}
                className="flex items-start gap-3 pt-2 text-left transition-transform active:scale-[0.99]"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    hasAgreedPolicies
                      ? 'border-gold bg-gold text-dark'
                      : 'border-white/20 bg-white/5 text-transparent'
                  }`}
                >
                  <Check size={13} strokeWidth={4} />
                </span>
                <span className="text-[11px] leading-relaxed text-white/35">
                  已阅读并同意<span className="text-sky-400">《用户协议》</span>和
                  <span className="text-sky-400">《隐私政策》</span>
                </span>
              </button>
            </motion.div>
          )}

          {stage === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/30">注册邀请码</label>
                <input
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.trimStart().toUpperCase());
                    setInviteError('');
                  }}
                  inputMode="numeric"
                  placeholder="请输入邀请码或 DR 订单号"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20 uppercase"
                />
                <p className="text-xs leading-relaxed text-white/35">
                  输入好友的<span className="text-sky-400">邀请码</span>或者您的
                  <span className="text-sky-400">订单号</span>
                </p>
                {inviteError && <p className="text-xs font-bold text-red-primary">{inviteError}</p>}
              </div>

              <button
                onClick={handleInviteSubmit}
                disabled={!canSubmitInvite || checking}
                className="h-14 w-full rounded-2xl bg-white font-black text-dark shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
              >
                验证
              </button>
            </motion.div>
          )}

          {stage === 'sms' && (
            <motion.div
              key="sms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-3xl font-black text-white">验证码</label>
                <p className="text-xs font-bold text-white/40">验证码已发送至 {normalizedPhone}</p>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        codeInputRefs.current[index] = el;
                      }}
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleVerificationCodeKeyDown(index, e.key)}
                      onPaste={(e) => {
                        e.preventDefault();
                        handleVerificationCodeChange(index, e.clipboardData.getData('text'));
                      }}
                      inputMode="numeric"
                      maxLength={4}
                      className="aspect-square w-full rounded-2xl border border-white/10 bg-white/5 text-center text-2xl font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    const reasons = [
                      '1. 请检查手机号输入是否正确。',
                      '2. 请确认手机是否开启了短信拦截。',
                      '3. 由于网络原因，短信可能会有延迟，请耐心等待。',
                      '4. 若多次尝试未果，请联系人工客服处理。',
                    ];
                    alert(`收不到验证码可能的原因：\n\n${reasons.join('\n')}`);
                  }}
                  className="text-xs font-black tracking-widest text-sky-400 transition-transform hover:text-sky-300 active:scale-95"
                >
                  收不到验证码
                </button>
                <button
                  onClick={requestSmsCode}
                  disabled={checking || countdown > 0}
                  className={`text-xs font-black tracking-widest transition-transform hover:text-sky-300 active:scale-95 disabled:opacity-40 ${
                    countdown > 0 ? 'text-white/35' : 'text-sky-400'
                  }`}
                >
                  {checking ? '发送中...' : countdown > 0 ? `${countdown}s` : '重新发送'}
                </button>
              </div>

              <button
                onClick={handleLoginSubmit}
                disabled={!canLogin || checking}
                className="h-14 w-full rounded-2xl bg-white font-black text-dark shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
              >
                登录
              </button>
            </motion.div>
          )}

          {stage === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="mb-6 flex justify-center">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => setAvatar((event.target?.result as string) || null);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="avatar-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-white/5"
                  >
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="px-2 text-center text-xs text-white/30">上传头像</span>
                    )}
                  </label>
                </div>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="给自己取个名字"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/30">一句话介绍</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="你想记录什么样的真实此刻？"
                  className="h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/30">生日</label>
                <input
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  type="date"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white outline-none transition-all focus:ring-2 focus:ring-gold/20 [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/30">性别</label>
                <div className="grid grid-cols-2 gap-2">
                  {['男', '女'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setGender(item)}
                      className={`h-12 rounded-2xl border text-sm font-black transition-all ${
                        gender === item
                          ? 'border-gold bg-gold text-dark shadow-lg shadow-gold/10'
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleProfileSubmit}
                disabled={!canSubmitProfile}
                className="h-14 w-full rounded-2xl bg-white font-black text-dark shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
              >
                完成并进入DR圈
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === 'phone' && provider === 'phone' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-auto pb-2 pt-8">
          <div className="my-8 flex items-center gap-4 text-white/10">
            <div className="h-px flex-1 bg-current" />
            <span className="text-[10px] font-black uppercase">或</span>
            <div className="h-px flex-1 bg-current" />
          </div>

          <button
            onClick={() => handleThirdPartyLogin('wechat')}
            disabled={checking}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 font-black text-white disabled:opacity-40"
          >
            微信登录
          </button>
          <button
            onClick={() => handleThirdPartyLogin('apple')}
            disabled={checking}
            className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 font-black text-white disabled:opacity-40"
          >
            Apple 登录
          </button>
        </motion.div>
      )}

      {isThirdPartyBinding && stage === 'phone' && (
        <button
          onClick={() => resetAuthForm('phone')}
          className="mt-6 text-xs font-black uppercase tracking-widest text-white/40 transition-colors hover:text-white"
        >
          切换其他方式
        </button>
      )}

      <AnimatePresence>
        {isPolicyDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 px-6"
            onClick={() => setIsPolicyDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#111111] p-6 text-left shadow-2xl"
            >
              <h3 className="text-lg font-black text-white">用户协议及隐私保护</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                已阅读并同意<span className="text-sky-400">《用户协议》</span>和
                <span className="text-sky-400">《隐私政策》</span>
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsPolicyDialogOpen(false)}
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 font-black text-white"
                >
                  不同意
                </button>
                <button
                  onClick={() => {
                    setHasAgreedPolicies(true);
                    setIsPolicyDialogOpen(false);
                    continuePendingPolicyAction(pendingPolicyAction);
                    setPendingPolicyAction(null);
                  }}
                  className="h-12 flex-1 rounded-2xl bg-white font-black text-dark"
                >
                  同意
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSmsBackDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 px-6"
            onClick={() => setIsSmsBackDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#111111] p-6 text-left shadow-2xl"
            >
              <h3 className="text-lg font-black text-white">确定返回并重新开始？</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                短信验证码可能略有延迟，请耐心等待。
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsSmsBackDialogOpen(false)}
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 font-black text-white"
                >
                  继续等待
                </button>
                <button
                  onClick={() => {
                    setIsSmsBackDialogOpen(false);
                    setStage(isDrUserPhone ? 'phone' : 'invite');
                  }}
                  className="h-12 flex-1 rounded-2xl bg-white font-black text-dark"
                >
                  返回
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[180] flex items-center justify-center bg-black/50"
          >
            <div className="h-14 w-14 rounded-full border-4 border-white/15 border-t-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CompletionScreen({
  result,
  onRestart,
}: {
  result: AuthResult;
  onRestart: () => void;
}) {
  return (
    <section className="flex h-full flex-col justify-between bg-dark p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300">
            DEPLOY READY
          </div>
          <CircleCheckBig className="text-emerald-300" size={28} />
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-bold leading-tight text-white">登录注册流程已独立完成</h2>
          <p className="text-sm leading-relaxed text-white/50">
            这个页面现在是一个独立的小项目，可以直接作为认证落地页部署，不再依赖主应用里的其他页面。
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {result.provider === 'apple' ? (
                <ShieldCheck size={24} className="text-gold" />
              ) : (
                <Sparkles size={24} className="text-gold" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/30">认证摘要</p>
              <p className="text-lg font-bold text-white">{result.nickname}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/35">登录方式</span>
              <span className="font-bold text-white">
                {result.provider === 'phone'
                  ? '手机号'
                  : result.provider === 'wechat'
                    ? '微信绑定手机号'
                    : 'Apple 登录'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/35">手机号</span>
              <span className="font-bold text-white">{result.phoneLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/35">生日</span>
              <span className="font-bold text-white">{result.birthday}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/35">性别</span>
              <span className="font-bold text-white">{result.gender}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-white/30">简介</p>
              <p className="mt-2 leading-relaxed text-white/70">{result.bio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[28px] border border-gold/15 bg-gold/10 p-4 text-sm leading-relaxed text-white/65">
          部署时把 <span className="font-black text-gold">auth-standalone</span> 作为项目根目录即可。
        </div>
        <button
          onClick={onRestart}
          className="h-14 w-full rounded-2xl bg-white font-black text-dark shadow-xl transition-transform active:scale-95"
        >
          重新体验登录注册流程
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<AuthResult | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-6 text-white md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl items-center justify-center">
        <section className="relative h-[900px] w-[430px] max-h-[calc(100vh-3rem)] max-w-full overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-2xl shadow-black/30">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(214,178,126,0.2),transparent_60%)]" />
          <div className="relative h-full">
            {result ? (
              <CompletionScreen result={result} onRestart={() => setResult(null)} />
            ) : (
              <AuthFlow onComplete={setResult} showToast={(message) => setToast(message)} />
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-5 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
