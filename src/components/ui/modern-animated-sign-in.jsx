
import {
  memo,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// ==================== Input Component ====================

const Input = memo(
  forwardRef(function Input(
    { className, type, ...props },
    ref
  ) {
    const radius = 100;
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          #3b82f6,
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='group/input rounded-lg p-[2px] transition duration-300'
      >
        <input
          type={type}
          className={cn(
            `shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  })
);

Input.displayName = 'Input';

// ==================== BoxReveal Component ====================

const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
  overflow = 'hidden',
  position = 'relative',
  className,
}) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    } else {
      slideControls.start('hidden');
      mainControls.start('hidden');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position,
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial='hidden'
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? '#5046e6',
          borderRadius: 4,
        }}
      />
    </section>
  );
});

// ==================== Ripple Component ====================

const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = '',
}) {
  return (
    <section
      className={`max-w-[50%] absolute inset-0 flex items-center justify-center
        dark:bg-white/5 bg-neutral-50
        [mask-image:linear-gradient(to_bottom,black,transparent)]
        dark:[mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
        const borderOpacity = 5 + i * 5;

        return (
          <span
            key={i}
            className='absolute animate-ripple rounded-full bg-foreground/15 border'
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: '1px',
              borderColor: `hsl(var(--foreground) / ${borderOpacity / 100})`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

// ==================== OrbitingCircles Component ====================

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}) {
  return (
    <>
      {path && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          className='pointer-events-none absolute inset-0 size-full'
        >
          <circle
            className='stroke-black/10 stroke-1 dark:stroke-white/10'
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
          />
        </svg>
      )}
      <section
        style={
          {
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
          }
        }
        className={cn(
          'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full [animation-delay:calc(var(--delay)*1000ms)]',
          { '[animation-direction:reverse]': reverse },
          className
        )}
      >
        {children}
      </section>
    </>
  );
});

// ==================== TechOrbitDisplay Component ====================

const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = 'Apprentice Portal',
}) {
  return (
    <section className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg'>
      <span className='pointer-events-none whitespace-pre-wrap text-black text-center text-4xl md:text-6xl lg:text-7xl font-semibold leading-none'>
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

// ==================== AnimatedForm Component ====================

const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  errorField, // This prop now holds the error string
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  goTo,
  textVariantButton,
  onTextVariantClick,
  customButton, // New prop for custom button
  customButtonAction, // New prop for custom button action
  customButtonText, // New prop for custom button text
  customButtonLoading, // New prop for custom button loading state
}) {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event) => {
    const currentErrors = {};
    fields.forEach((field) => {
      const value = event.target[field.label]?.value;

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = 'Invalid email address';
      }

      if (field.type === 'password' && value && value.length < 6) {
        currentErrors[field.label] =
          'Password must be at least 6 characters long';
      }
    });
    return currentErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className='w-full md:w-96 flex flex-col gap-4 mx-auto'>
      <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
        <h2 className='font-bold text-3xl text-black'>
          {header}
        </h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal boxColor='var(--skeleton)' duration={0.3} className='pb-2'>
          <p className='text-black text-sm max-w-sm'>
            {subHeader}
          </p>
        </BoxReveal>
      )}

      {errorField && (
        <BoxReveal width='100%' boxColor='var(--skeleton)' duration={0.3}>
            {(() => {
                // Check if this is a status message
                if (errorField.startsWith('STATUS:')) {
                    const [, status, ...messageParts] = errorField.split(':');
                    const message = messageParts.join(':'); // Re-join in case message contains colons
                    
                    if (status === 'APPROVED') {
                        return (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-green-100/80 border border-green-400 text-green-800 px-4 py-4 rounded-lg relative my-4 text-sm flex items-center gap-3 shadow-lg" 
                                role="alert"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                >
                                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-600" />
                                </motion.div>
                                <div>
                                    <div className="font-semibold mb-1">✅ Account Approved!</div>
                                    <span>{message}</span>
                                </div>
                            </motion.div>
                        );
                    } else if (status === 'PENDING') {
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-orange-100/80 border border-orange-400 text-orange-800 px-4 py-4 rounded-lg relative my-4 text-sm flex items-center gap-3 shadow-lg" 
                                role="alert"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Clock className="w-6 h-6 flex-shrink-0 text-orange-600" />
                                </motion.div>
                                <div>
                                    <div className="font-semibold mb-1">⏳ Pending Approval</div>
                                    <span>{message}</span>
                                </div>
                            </motion.div>
                        );
                    } else if (status === 'REJECTED') {
                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-red-100/80 border border-red-400 text-red-800 px-4 py-4 rounded-lg relative my-4 text-sm flex items-center gap-3 shadow-lg" 
                                role="alert"
                            >
                                <XCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
                                <div>
                                    <div className="font-semibold mb-1">❌ Access Denied</div>
                                    <span>{message}</span>
                                </div>
                            </motion.div>
                        );
                    }
                }
                
                // Default error styling for regular errors
                return (
                    <div className="bg-red-100/70 border border-red-400 text-red-800 px-4 py-3 rounded-md relative my-4 text-sm flex items-center gap-3" role="alert">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorField}</span>
                    </div>
                );
            })()}
        </BoxReveal>
      )}

      {googleLogin && goTo && (
        <>
          <BoxReveal
            boxColor='var(--skeleton)'
            duration={0.3}
            overflow='visible'
            width='unset'
          >
            <button
              className='g-button group/btn bg-transparent w-full rounded-md border h-10 font-medium outline-hidden hover:cursor-pointer'
              type='button'
              onClick={goTo}
            >
              <span className='flex items-center justify-center w-full h-full gap-3'>
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal boxColor='var(--skeleton)' duration={0.3} width='100%'>
            <section className='flex items-center gap-4'>
              <hr className='flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700' />
              <p className='text-neutral-700 text-sm'>
                or
              </p>
              <hr className='flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700' />
            </section>
          </BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <section className={`grid grid-cols-1 md:grid-cols-${fieldPerRow} mb-4`}>
          {fields.map((field) => (
            <section key={field.label} className='flex flex-col gap-2'>
              <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
                <Label htmlFor={field.label}>
                  {field.label} <span className='text-red-500'>*</span>
                </Label>
              </BoxReveal>

              <BoxReveal
                width='100%'
                boxColor='var(--skeleton)'
                duration={0.3}
                className='flex flex-col space-y-2 w-full'
              >
                <section className='relative'>
                  <Input
                    type={
                      field.type === 'password'
                        ? visible
                          ? 'text'
                          : 'password'
                        : field.type
                    }
                    id={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                  />

                  {field.type === 'password' && (
                    <button
                      type='button'
                      onClick={toggleVisibility}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
                    >
                      {visible ? (
                        <Eye className='h-5 w-5' />
                      ) : (
                        <EyeOff className='h-5 w-5' />
                      )}
                    </button>
                  )}
                </section>

                <section className='h-4'>
                  {errors[field.label] && (
                    <p className='text-red-500 text-xs'>
                      {errors[field.label]}
                    </p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal
          width='100%'
          boxColor='var(--skeleton)'
          duration={0.3}
          overflow='visible'
        >
          <button
            className='bg-gradient-to-br relative group/btn from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 block w-full text-white
            rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
              dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer'
            type='submit'
          >
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>
      </form>

      {/* Custom Button Section - between form and textVariantButton */}
      {(customButtonAction || customButton) && (
        <BoxReveal
          width='100%'
          boxColor='var(--skeleton)'
          duration={0.3}
          overflow='visible'
        >
          {customButton || (
            <button
              onClick={customButtonAction}
              disabled={customButtonLoading}
              type="button"
              className="bg-gradient-to-br relative group/btn from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 block w-full text-white
              rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
                dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer"
            >
              <span className="text-sm flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                {customButtonLoading ? 'Checking...' : (customButtonText || 'Check Status')}
              </span>
              <BottomGradient />
            </button>
          )}
        </BoxReveal>
      )}

      {textVariantButton && (
        <BoxReveal boxColor='var(--skeleton)' duration={0.3} width='100%'>
          <button
            type='button'
            onClick={onTextVariantClick}
            className='text-sm text-neutral-600 hover:underline w-full text-center mt-2'
          >
            {textVariantButton}
          </button>
        </BoxReveal>
      )}
    </section>
  );
});

// ==================== CheckStatusButton Component ====================

// This component is no longer used directly in AnimatedForm or exported, but kept as it was in the original code.
// The new custom button logic in AnimatedForm replaces its functionality in the specified use case.
const CheckStatusButton = memo(function CheckStatusButton({
  className,
  onClick,
  children = 'Check Status', // Default text for the button
  ...props
}) {
  return (
    <button
      className={cn(
        `bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900
        dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black
        rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
        dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer`,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children} &rarr;
      <BottomGradient />
    </button>
  );
});


const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent' />
      <span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
    </>
  );
};

// ==================== AuthTabs Component ====================

const AuthTabs = memo(function AuthTabs({
  formFields,
  goTo,
  handleSubmit,
  customButton, // New prop to pass through
  customButtonAction, // New prop to pass through
  customButtonText, // New prop to pass through
  customButtonLoading, // New prop to pass through
}) {
  return (
    <div className='flex max-lg:justify-center w-full md:w-auto'>
      <div className='w-full lg:w-1/2 h-[100dvh] flex flex-col justify-center items-center'>
        <AnimatedForm
          {...formFields}
          fieldPerRow={1}
          onSubmit={handleSubmit}
          goTo={goTo}
          googleLogin='Create Account'
          customButton={customButton}
          customButtonAction={customButtonAction}
          customButtonText={customButtonText}
          customButtonLoading={customButtonLoading}
        />
      </div>
    </div>
  );
});

// ==================== Label Component ====================

const Label = memo(function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black',
        className
      )}
      {...props}
    />
  );
});

// ==================== Exports ====================

export {
  Input,
  BoxReveal,
  Ripple,
  OrbitingCircles,
  TechOrbitDisplay,
  AnimatedForm,
  AuthTabs,
  Label,
  BottomGradient,
};
