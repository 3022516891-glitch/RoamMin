import type { VerificationRequest, VerificationStatus } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';

export const verificationApi = {
  async status(): Promise<VerificationStatus> {
    return useMock ? mock.verification() : request('GET', '/users/me/verification');
  },
  async verify(data: VerificationRequest): Promise<VerificationStatus> {
    if (!data.consent) throw new Error('请先阅读并同意实名认证说明');
    if (data.realName.trim().length < 2) throw new Error('请输入真实姓名');
    if (!/^\d{17}[\dXx]$/.test(data.idNumber.trim())) throw new Error('请输入有效的 18 位身份证号码');
    if (!useMock) return request('POST', '/users/me/verification', data);
    const status = { verified: true, verifiedAt: new Date().toISOString() };
    mock.saveVerification(status);
    return status;
  }
};
