import React from "react";

export const HamsterLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
      <style jsx>{`
        .hamster-wheel {
          --dur: 1s;
          position: relative;
          width: 12em;
          height: 12em;
        }

        .hamster-wheel__hamster {
          animation: hamsterRun var(--dur) linear infinite;
          position: absolute;
          top: 50%;
          left: calc(50% - 3.5em);
          width: 7em;
          height: 3.75em;
          transform: translate(0, -50%);
        }

        .hamster-wheel__hamster div {
          position: absolute;
        }

        .hamster-wheel__body,
        .hamster-wheel__limb--fr,
        .hamster-wheel__limb--fl,
        .hamster-wheel__limb--br,
        .hamster-wheel__limb--bl {
          background: linear-gradient(hsl(30, 90%, 55%), hsl(30, 90%, 45%));
        }

        .hamster-wheel__head {
          animation: hamsterHead var(--dur) ease-in-out infinite;
          background: hsl(30, 90%, 55%);
          border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
          box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset,
            0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
          top: 0;
          left: -2em;
          width: 2.75em;
          height: 2.5em;
          transform-origin: 100% 50%;
        }

        .hamster-wheel__ear {
          animation: hamsterEar var(--dur) ease-in-out infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 50%;
          top: -0.25em;
          right: -0.25em;
          width: 0.75em;
          height: 0.75em;
          transform-origin: 50% 75%;
        }

        .hamster-wheel__eye {
          animation: hamsterEye var(--dur) linear infinite;
          background: hsl(0, 0%, 0%);
          border-radius: 50%;
          top: 0.375em;
          left: 1.25em;
          width: 0.5em;
          height: 0.5em;
        }

        .hamster-wheel__nose {
          background: hsl(0, 90%, 75%);
          border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
          top: 0.75em;
          left: 0;
          width: 0.2em;
          height: 0.25em;
        }

        .hamster-wheel__body {
          animation: hamsterBody var(--dur) ease-in-out infinite;
          border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
          top: 0.5em;
          left: 2em;
          width: 4.5em;
          height: 3em;
          transform-origin: 17% 50%;
          transform-style: preserve-3d;
        }

        .hamster-wheel__limb {
          border-radius: 50% / 25% 25% 50% 50%;
          width: 1em;
          height: 1.5em;
          transform-origin: 50% 0;
        }

        .hamster-wheel__limb--fr,
        .hamster-wheel__limb--fl {
          clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
          top: 2em;
          left: 0.5em;
          width: 1em;
          height: 1.5em;
        }

        .hamster-wheel__limb--fr {
          animation: hamsterFRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%), hsl(30, 90%, 45%));
          transform: rotate(15deg) translateZ(-1px);
        }

        .hamster-wheel__limb--fl {
          animation: hamsterFLLimb var(--dur) linear infinite;
          transform: rotate(15deg);
        }

        .hamster-wheel__limb--br,
        .hamster-wheel__limb--bl {
          border-radius: 50% / 25% 25% 50% 50%;
          clip-path: polygon(
            0 0,
            100% 0,
            100% 30%,
            70% 90%,
            70% 100%,
            30% 100%,
            40% 90%,
            0% 30%
          );
          top: 1em;
          left: 2.8em;
          width: 1.5em;
          height: 2.5em;
        }

        .hamster-wheel__limb--br {
          animation: hamsterBRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%), hsl(30, 90%, 45%));
          transform: rotate(-25deg) translateZ(-1px);
        }

        .hamster-wheel__limb--bl {
          animation: hamsterBLLimb var(--dur) linear infinite;
          transform: rotate(-25deg);
        }

        .hamster-wheel__tail {
          animation: hamsterTail var(--dur) linear infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 25% 75% 25% 75% / 25% 75% 25% 75%;
          top: 1.5em;
          right: -0.5em;
          width: 1em;
          height: 0.5em;
          transform: rotate(30deg) translateZ(-1px);
        }

        .hamster-wheel__wheel {
          background: linear-gradient(hsl(0, 0%, 90%), hsl(0, 0%, 80%));
          border-radius: 50%;
          box-shadow: 0 0 0 0.5em hsl(0, 0%, 90%) inset,
            0 0 0 0.75em hsl(0, 0%, 60%) inset;
          top: 50%;
          left: 0;
          width: 12em;
          height: 12em;
          transform: translate(0, -50%);
        }

        .hamster-wheel__wheel-inner {
          animation: hamsterWheelRotate var(--dur) linear infinite;
          position: relative;
          border-radius: inherit;
          width: inherit;
          height: inherit;
        }

        .hamster-wheel__wheel-spokes {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .hamster-wheel__wheel-spokes:before,
        .hamster-wheel__wheel-spokes:after {
          background: hsl(0, 0%, 75%);
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 0.25em;
          transform: translate(0, -50%);
        }

        .hamster-wheel__wheel-spokes:after {
          transform: translate(0, -50%) rotate(90deg);
        }

        @keyframes hamsterRun {
          from,
          to {
            transform: translate(0, -50%) rotate(0);
          }
          50% {
            transform: translate(-0.5em, -50%) rotate(180deg);
          }
        }

        @keyframes hamsterHead {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(8deg);
          }
        }

        @keyframes hamsterEye {
          from,
          90%,
          to {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0);
          }
        }

        @keyframes hamsterEar {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(12deg);
          }
        }

        @keyframes hamsterBody {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(0);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-2deg);
          }
        }

        @keyframes hamsterFRLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(50deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-30deg) translateZ(-1px);
          }
        }

        @keyframes hamsterFLLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(-30deg);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(50deg);
          }
        }

        @keyframes hamsterBRLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(-60deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(20deg) translateZ(-1px);
          }
        }

        @keyframes hamsterBLLimb {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(20deg);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(-60deg);
          }
        }

        @keyframes hamsterTail {
          from,
          25%,
          50%,
          75%,
          to {
            transform: rotate(30deg) translateZ(-1px);
          }
          12.5%,
          37.5%,
          62.5%,
          87.5% {
            transform: rotate(10deg) translateZ(-1px);
          }
        }

        @keyframes hamsterWheelRotate {
          from {
            transform: rotate(0);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>

      <div className="hamster-wheel" aria-label="Loading animation">
        <div className="hamster-wheel__hamster" aria-hidden="true">
          <div className="hamster-wheel__body">
            <div className="hamster-wheel__head">
              <div className="hamster-wheel__ear"></div>
              <div className="hamster-wheel__eye"></div>
              <div className="hamster-wheel__nose"></div>
            </div>
            <div className="hamster-wheel__limb hamster-wheel__limb--fr"></div>
            <div className="hamster-wheel__limb hamster-wheel__limb--fl"></div>
            <div className="hamster-wheel__limb hamster-wheel__limb--br"></div>
            <div className="hamster-wheel__limb hamster-wheel__limb--bl"></div>
            <div className="hamster-wheel__tail"></div>
          </div>
        </div>
        <div className="hamster-wheel__wheel">
          <div className="hamster-wheel__wheel-inner">
            <div className="hamster-wheel__wheel-spokes"></div>
          </div>
        </div>
      </div>

      {text && (
        <p className="text-muted-foreground mt-8 text-lg font-medium">{text}</p>
      )}
    </div>
  );
};
