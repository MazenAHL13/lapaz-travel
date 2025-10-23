import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./config";

WebBrowser.maybeCompleteAuthSession();


export function useGoogleAuth() {
  const redirectUri = "https://lapaztravel.firebaseapp.com/__/auth/handler";
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "824761370595-2u2hl39rv8r00f7ri92tgmernm98lfv3.apps.googleusercontent.com",
    androidClientId: "824761370595-8rutetq4nagjr746ou176nftfdk02spr.apps.googleusercontent.com",
    iosClientId: "824761370595-9ulb0ntvqjsiln1oscmisftojl2l3j8n.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return { promptAsync, request, response };
}