import { motion } from "framer-motion";
import * as React from "react";

type ViewWrapperProps = {};

export const ViewWrapper: React.FC<ViewWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      exit={{ opacity: 0.7, y: 20, transition: { duration: 0.15 } }}
    >
      {children}
    </motion.div>
  );
};
