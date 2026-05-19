import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { COUNTRY_CODES } from '../constants';
import type { Screen } from '../types';

type AuthProvider = 'phone' | 'wechat' | 'apple';
type AuthView = 'auth' | 'profile';
type AuthStage = 'phone' | 'invite' | 'sms';
type PendingPolicyAction =
  | 'phone'
  | 'login'
  | { type: 'thirdParty'; provider: Exclude<AuthProvider, 'phone'> };

interface LoginScreenProps {
  setScreen: (screen: Screen) => void;
  showToast: (message: string) => void;
}

export default function LoginScreen({ setScreen, showToast }: LoginScreenProps) {
  const [view, setView] = useState<AuthView>('auth');
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
  const [verificationError, setVerificationError] = useState('');
  const [inviteVerified, setInviteVerified] = useState(false);
  const [hasAgreedPolicies, setHasAgreedPolicies] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isSmsBackDialogOpen, setIsSmsBackDialogOpen] = useState(false);
  const [pendingPolicyAction, setPendingPolicyAction] =
    useState<PendingPolicyAction | null>(null);
  const [smsRequestCount, setSmsRequestCount] = useState(0);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const maxDailySmsRequests = 10;

  useEffect(() => {
    let timer: number | undefined;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (verificationCode.length === 4 && codeSent) {
      handleLoginSubmit();
    }
  }, [verificationCode, codeSent]);

  const normalizedPhone = phone.replace(/\D/g, '');
  const canSubmitPhone = normalizedPhone.length === 11;
  const isDrUserPhone = normalizedPhone === '15112341263';
  const canSubmitInvite = inviteCode.trim().length > 0;
  const canLogin = codeSent && verificationCode.trim().length === 4;
  const canSubmitProfile = nickname.trim().length > 0 && birthday && gender;
  const isThirdPartyBinding = provider !== 'phone';

  const resetAuthForm = (nextProvider: AuthProvider = 'phone') => {
    setView('auth');
    setStage('phone');
    setProvider(nextProvider);
    setPhone('');
    setVerificationCode('');
    setInviteCode('');
    setCodeSent(false);
    setInviteError('');
    setInviteVerified(false);
    setCountdown(0);
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

  const handlePhoneSubmit = () => {
    if (!requirePolicyAgreement('phone')) return;
    continuePhoneSubmit();
  };

  const handleLoginSubmit = () => {
    if (!requirePolicyAgreement('login')) return;
    if (!canLogin) return;
    setVerificationError('');
    setView('profile');
  };

  const handleInviteSubmit = () => {
    if (!canSubmitInvite || inviteCode.trim() !== '332233') {
      setInviteError('邀请码错误');
      setInviteVerified(false);
      return;
    }
    setInviteError('');
    setInviteVerified(true);
    requestSmsCode();
  };

  const requirePolicyAgreement = (action?: PendingPolicyAction) => {
    if (hasAgreedPolicies) return true;
    setPendingPolicyAction(action || null);
    setIsPolicyDialogOpen(true);
    return false;
  };

  const handleInviteChange = (value: string) => {
    const next = value.trimStart().toUpperCase();
    setInviteCode(next);
    setInviteVerified(false);
    setInviteError('');
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    setVerificationError('');
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

  const continueThirdPartyLogin = (nextProvider: Exclude<AuthProvider, 'phone'>) => {
    if (nextProvider === 'apple') {
      setScreen('home');
      return;
    }

    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      const thirdPartyAlreadyBound = false;
      if (thirdPartyAlreadyBound) {
        setScreen('home');
      } else {
        resetAuthForm(nextProvider);
      }
    }, 450);
  };

  const handleThirdPartyLogin = (nextProvider: Exclude<AuthProvider, 'phone'>) => {
    if (!requirePolicyAgreement({ type: 'thirdParty', provider: nextProvider })) return;
    continueThirdPartyLogin(nextProvider);
  };

  const continuePendingPolicyAction = (action: PendingPolicyAction | null) => {
    if (!action) return;
    if (action === 'phone') {
      continuePhoneSubmit();
      return;
    }
    if (action === 'login') {
      if (canLogin) setView('profile');
      return;
    }
    continueThirdPartyLogin(action.provider);
  };

  const authTitle = isThirdPartyBinding ? '绑定手机号' : '登录 / 注册';
  const pageTitle = view === 'profile' ? '填写资料' : stage === 'invite' ? '邀请码' : authTitle;

  return (
    <section className="relative flex flex-col h-full p-8 pt-24 overflow-y-auto no-scrollbar bg-dark">
      {((view === 'auth' && (stage === 'phone' || stage === 'invite')) || view === 'profile') && (
        <>
          {view === 'profile' && (
            <div className="mb-12 flex items-center justify-between">
              <button
                onClick={() => setView('auth')}
                className="w-11 h-11 glass-pill rounded-2xl flex items-center justify-center border border-white/5 text-white active:scale-95 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-11 h-11" />
            </div>
          )}
          <div className="space-y-4 mb-12">
            {stage === 'invite' && (
              <button
                onClick={() => setStage('phone')}
                aria-label="修改手机号"
                className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center active:scale-95 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-4xl font-bold leading-tight text-white">{pageTitle}</h1>
            {view === 'auth' && stage === 'phone' && provider === 'phone' && (
              <p className="text-sm font-bold text-white/35">首次登录会自动创建新账号</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-4">
        {view === 'auth' && (
          <AnimatePresence>
            {stage === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/30 uppercase">手机号</label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="h-14 bg-white/5 rounded-2xl px-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10 w-24 flex items-center justify-between gap-1"
                      >
                        {countryCode}
                        <ChevronDown size={16} />
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute top-16 left-0 z-20 w-56 bg-[#1B1B1B] border border-white/10 rounded-2xl p-2 shadow-2xl max-h-60 overflow-y-auto">
                          {COUNTRY_CODES.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => {
                                setCountryCode(c.code);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 text-white rounded-lg flex items-center justify-between"
                            >
                              <span>{c.name}</span>
                              <span className="opacity-60">{c.code}</span>
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
                        setInviteVerified(false);
                        setVerificationCode('');
                        setCodeSent(false);
                      }}
                      inputMode="tel"
                      className="flex-1 h-14 bg-white/5 rounded-2xl px-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10"
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePhoneSubmit}
                  disabled={!canSubmitPhone || checking}
                  className="w-full h-14 bg-white text-dark font-black rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                >
                  获取验证码
                </button>

                <button
                  onClick={() => setHasAgreedPolicies((prev) => !prev)}
                  className="flex items-start gap-3 text-left pt-2 active:scale-[0.99] transition-transform"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      hasAgreedPolicies
                        ? 'bg-gold border-gold text-dark'
                        : 'border-white/20 bg-white/5 text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={4} />
                  </span>
                  <span className="text-[11px] text-white/35 leading-relaxed">
                    已阅读并同意<span className="text-blue-400">《用户协议》</span>和
                    <span className="text-blue-400">《隐私政策》</span>
                  </span>
                </button>
              </motion.div>
            )}

            {stage === 'invite' && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/30 uppercase">注册邀请码</label>
                  <input
                    value={inviteCode}
                    onChange={(e) => handleInviteChange(e.target.value)}
                    inputMode="numeric"
                    className="w-full h-14 bg-white/5 rounded-2xl px-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10 uppercase"
                    placeholder="请输入邀请码或DR订单号"
                  />
                  <p className="text-xs font-bold text-white/35 leading-relaxed">
                    输入好友的
                    <button
                      type="button"
                      className="text-sky-400 font-black px-0.5 active:scale-95 transition-transform"
                    >
                      邀请码
                    </button>
                    或您的
                    <button
                      type="button"
                      className="text-sky-400 font-black px-0.5 active:scale-95 transition-transform"
                    >
                      订单号
                    </button>
                  </p>
                  {inviteError && <p className="text-xs font-bold text-red-primary">{inviteError}</p>}
                  {inviteVerified && !inviteError && (
                    <p className="text-xs font-bold text-emerald-400">邀请码可用</p>
                  )}
                </div>
                <button
                  onClick={handleInviteSubmit}
                  disabled={!canSubmitInvite || checking}
                  className="w-full h-14 bg-white text-dark font-black rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                >
                  验证
                </button>
              </motion.div>
            )}

            {stage === 'sms' && (
              <motion.div
                key="sms"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setIsSmsBackDialogOpen(true)}
                  aria-label="返回上一步"
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft size={20} />
                </button>
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
                        className="w-full aspect-square bg-white/5 rounded-2xl text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10"
                      />
                    ))}
                  </div>
                  {verificationError && (
                    <p className="text-xs font-bold text-red-primary mt-2">{verificationError}</p>
                  )}
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
                    className="text-xs font-black text-sky-400 tracking-widest active:scale-95 transition-transform hover:text-sky-300"
                  >
                    收不到验证码
                  </button>
                  <button
                    onClick={requestSmsCode}
                    disabled={checking || countdown > 0}
                    className={`text-xs font-black tracking-widest active:scale-95 transition-transform hover:text-sky-300 disabled:opacity-40 ${
                      countdown > 0 ? 'text-white/35' : 'text-sky-400'
                    }`}
                  >
                    {checking ? '发送中...' : countdown > 0 ? `${countdown}s` : '重新发送'}
                  </button>
                </div>
                <button
                  onClick={handleLoginSubmit}
                  disabled={!canLogin || checking}
                  className="w-full h-14 bg-white text-dark font-black rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                >
                  登录
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {view === 'profile' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-center mb-6">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => setAvatar(event.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="avatar-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="avatar-upload"
                  className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 cursor-pointer overflow-hidden"
                >
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <span className="text-white/30 text-xs text-center px-2">上传头像</span>
                  )}
                </label>
              </div>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-14 bg-white/5 rounded-2xl px-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10"
                placeholder="给自己取个名字"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase">一句话介绍</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-24 bg-white/5 rounded-2xl px-4 py-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10 resize-none"
                placeholder="你想记录什么样的真实此刻？"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase">生日</label>
              <input
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                }}
                type="date"
                className="w-full h-14 bg-white/5 rounded-2xl px-4 font-bold text-white outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-inner border border-white/10 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-white/30 uppercase">性别</label>
              <div className="grid grid-cols-2 gap-2">
                {['男', '女'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setGender(item)}
                    className={`h-12 rounded-2xl text-sm font-black transition-all border ${
                      gender === item
                        ? 'bg-gold text-dark border-gold shadow-lg shadow-gold/10'
                        : 'bg-white/5 text-white/50 border-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setScreen('home')}
              disabled={!canSubmitProfile}
              className="w-full h-14 bg-white text-dark font-black rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 disabled:active:scale-100"
            >
              完成并进入 DR圈
            </button>
          </>
        )}
      </div>

      {view === 'auth' && provider === 'phone' && stage === 'phone' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-auto pb-8">
          <div className="flex items-center gap-4 my-8 text-white/10">
            <div className="h-[1px] flex-1 bg-current" />
            <span className="text-[10px] font-black uppercase">或</span>
            <div className="h-[1px] flex-1 bg-current" />
          </div>

          <button
            onClick={() => handleThirdPartyLogin('wechat')}
            disabled={checking}
            className="w-full h-14 bg-white/5 text-white font-black rounded-2xl flex items-center justify-center gap-2 border border-white/5 disabled:opacity-40"
          >
            微信登录
          </button>
          <button
            onClick={() => handleThirdPartyLogin('apple')}
            disabled={checking}
            className="w-full h-14 bg-white/5 text-white font-black rounded-2xl flex items-center justify-center gap-2 border border-white/5 disabled:opacity-40 mt-3"
          >
            Apple 登录
          </button>
        </motion.div>
      )}

      {view === 'auth' && isThirdPartyBinding && (
        <button
          onClick={() => resetAuthForm('phone')}
          className="mt-6 text-white/40 text-xs font-black tracking-widest uppercase hover:text-white transition-colors"
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
              <h3 className="text-white text-lg font-black">用户协议及隐私保护</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                已阅读并同意<span className="text-blue-400">《用户协议》</span>和
                <span className="text-blue-400">《隐私政策》</span>
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsPolicyDialogOpen(false)}
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 text-white font-black"
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
                  className="h-12 flex-1 rounded-2xl bg-white text-dark font-black"
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
              <h3 className="text-white text-lg font-black">确定返回并重新开始？</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                短信验证码可能略有延迟，请耐心等待。
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsSmsBackDialogOpen(false)}
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 text-white font-black"
                >
                  继续等待
                </button>
                <button
                  onClick={() => {
                    setIsSmsBackDialogOpen(false);
                    setStage(isDrUserPhone ? 'phone' : 'invite');
                  }}
                  className="h-12 flex-1 rounded-2xl bg-white text-dark font-black"
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
