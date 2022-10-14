import Image from "next/image";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });

// import dynamic from "next/dynamic";

// const FileViewer = dynamic(() => import("react-file-viewer"), {
//   ssr: false,
// });

// export default function Index() {
//   return <FileViewer fileType="pdf" filePath="/e4teaser.pdf" />;
// }

const Teaser = () => {
  return (
    // <Document>
    //   <Page size="A4" style={styles.page}>
    //     <View style={styles.section}>
    //       <Text>Section #1</Text>
    //     </View>
    //     <View style={styles.section}>
    //       <Text>Section #2</Text>
    //     </View>
    //   </Page>
    // </Document>
    <div className="flex flex-col container p-10">
      {/* <h2 className="text-center">
        <span className="text-xs">Updated on 14th October, 2022</span>
      </h2> */}

      <div className="text-center flex flex-row space-x-6 w-full justify-center my-6">
        <div>
          <Image
            src={"/e4teaser.jpg"}
            alt="E4 Teaser"
            width={2758}
            height={3600}
          />
        </div>
      </div>
    </div>
  );
};

export default Teaser;
