import { Link } from "../components/ui/link";

const TermsAndConditions = () => {
  return (
    <div className="p-8 flex-1 overflow-auto">
      <strong>Terms &amp; Conditions</strong>{" "}
      <p>
        By downloading or using app, these terms will automatically apply to you
        - you should make sure therefore that you read them carefully before
        using app. The app itself, and all trademarks, copyright, database
        rights, and other intellectual property rights related to it, belong to
        HKBUS.APP. The app is only for personal, non-commercial, or academic
        use. You may contact HKBUS.APP for commercial use licenses.
      </p>{" "}
      <p>
        HKBUS.APP is committed to ensuring that app is as useful and efficient
        as possible. For that reason, we reserve right to make changes to app or
        to charge for its services, at any time and for any reason. We will
        never charge you for app or its services without making it very clear to
        you exactly what you&apos;re paying for.
      </p>{" "}
      <p>
        The hkbus.app app stores and processes personal data that you have
        provided to us, to provide our Service. It&apos;s your responsibility to
        keep your phone and access to app secure. We therefore recommend that
        you do not jailbreak or root your phone, which is process of removing
        software restrictions and limitations imposed by official operating
        system of your device. It could make your phone vulnerable to
        malware/viruses/malicious programs, compromise your phone&apos;s
        security features and it could mean that hkbus.app app won&apos;t work
        properly or at all.
      </p>{" "}
      <div>
        <p>
          The app does use third-party services that declare their Terms and
          Conditions.
        </p>{" "}
        <p>
          Link to Terms and Conditions of third-party service providers used by
          app
        </p>{" "}
        <ul>
          <li>
            <Link
              href="https://marketingplatform.google.com/about/analytics/terms/us/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Google Analytics
            </Link>
          </li>
          <li>
            <Link
              href="https://firebase.google.com/terms/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Google Analytics for Firebase
            </Link>
          </li>
        </ul>
      </div>{" "}
      <p>
        You should be aware that there are certain things that HKBUS.APP will
        not take responsibility for. Certain functions of app will require app
        to have an active internet connection. The connection can be Wi-Fi or
        provided by your mobile network provider, but HKBUS.APP cannot take
        responsibility for app not working at full functionality if you
        don&apos;t have access to Wi-Fi, and you don&apos;t have any of your
        data allowance left.
      </p>{" "}
      <p></p>{" "}
      <p>
        If you&apos;re using app outside of an area with Wi-Fi, you should
        remember that terms of agreement with your mobile network provider will
        still apply. As a result, you may be charged by your mobile provider for
        cost of data for duration of connection while accessing app, or other
        third-party charges. In using app, you&apos;re accepting responsibility
        for any such charges, including roaming data charges if you use app
        outside of your home territory (i.e. region or country) without turning
        off data roaming. If you are not the bill payer for the device on which
        you&apos;re using app, please be aware that we assume that you have
        received permission from the bill payer for using app.
      </p>{" "}
      <p>
        Along same lines, HKBUS.APP cannot always take responsibility for way
        you use app i.e. You need to make sure that your device stays charged -
        if it runs out of battery and you can&apos;t turn it on to avail
        Service, HKBUS.APP cannot accept responsibility.
      </p>{" "}
      <p>
        With respect to HKBUS.APP&apos;s responsibility for your use of app,
        when you&apos;re using app, it&apos;s important to bear in mind that
        although we endeavor to ensure that it is updated and correct at all
        times, we do rely on third parties to provide information to us so that
        we can make it available to you. HKBUS.APP accepts no liability for any
        loss, direct or indirect, you experience as a result of relying wholly
        on this functionality of app.
      </p>{" "}
      <p>
        At some point, we may wish to update app. The app is currently available
        on Android &amp; iOS &amp; HarmonyOS - requirements for both systems(and
        for any additional systems we decide to extend availability of app to)
        may change, and you&apos;ll need to download updates if you want to keep
        using app. HKBUS.APP does not promise that it will always update app so
        that it is relevant to you and/or works with Android &amp; iOS &amp;
        HarmonyOS version that you have installed on your device. However, you
        promise to always accept updates to application when offered to you, We
        may also wish to stop providing app, and may terminate use of it at any
        time without giving notice of termination to you. Unless we tell you
        otherwise, upon any termination, (a) rights and licenses granted to you
        in these terms will end; (b) you must stop using app, and (if needed)
        delete it from your device.
      </p>{" "}
      <p>
        <strong>Changes to This Terms and Conditions</strong>
      </p>{" "}
      <p>
        We may update our Terms and Conditions from time to time. Thus, you are
        advised to review this page periodically for any changes. We will notify
        you of any changes by posting new Terms and Conditions on this page.
      </p>{" "}
      <p>These terms and conditions are effective as of 2022-02-23</p>{" "}
      <p>
        <strong>Contact Us</strong>
      </p>{" "}
      <p>
        If you have any questions or suggestions about our Terms and Conditions,
        do not hesitate to contact us at no-reply@hkbus.app.
      </p>
    </div>
  );
};

export default TermsAndConditions;
