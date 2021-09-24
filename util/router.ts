export const Router = {
  OnbordingScreen: 'Onbording',
  SMSInputScreen: '登録/ログイン',
  SMSVerifyScreen: '電話番号確認',
  OpnerScreen: '裁判員選択',
  TestTorScreen: 'TestTorScreen',
} as const;
export type Router = typeof Router[keyof typeof Router];
