export const Router = {
  OnbordingScreen: 'Onbording',
  SMSInputScreen: 'SignUp/In',
  SMSVarifyScreen: 'Varify',
  OpnerScreen: 'Opner',
} as const;
export type Router = typeof Router[keyof typeof Router];
