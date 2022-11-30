<template>
  <div>
    <el-form :model="postData" :rules="rules" label-position="top" ref="dataForm" label-width="100px"
      style="margin: 10px">
      <el-form-item prop="name" label="版本名称">
        <el-input v-model="postData.name"></el-input>
      </el-form-item>
      <el-form-item label="发布版本类型" prop="releaseType">
        <el-checkbox-group v-model="postData.releaseType">
          <el-checkbox label="iOS" @change="iOSRelease=$event">iOS</el-checkbox>
          <el-checkbox label="android" @change="androidRelease=$event">安卓</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="iOSVersionCode" label="iOS版本号" size="small" v-show="iOSRelease">
        <el-input-number v-model="postData.iOSVersionCode" placeholder="版本号"></el-input-number>
      </el-form-item>
      <el-form-item label="安卓Apk文件" v-show="androidRelease">
        <el-upload draggable :limit="1" :action="importData.uploadAction" :before-upload="checkFile"
          :on-success="uploaded" accept="application/vnd.android.package-archive" class="file-uploader">
          <i slot="default" class="el-icon-plus file-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
        </el-upload>
      </el-form-item>

      <el-form-item prop="androidPackageName" label="安卓包名">
        <el-input v-model="postData.androidPackageName" :disabled="apkUploaded" />
      </el-form-item>
      <el-form-item prop="androidVersionCode" label="安卓版本号" size="small">
        <el-input-number v-model="postData.androidVersionCode" :disabled="apkUploaded" />
      </el-form-item>
      <el-form-item prop="size" label="安卓包文件大小">
        <el-input type="number" v-model="postData.size" :disabled="apkUploaded" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="release">发布</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import * as params from '@/data/params.json';

  export default {
    name: "AddVersion",
    props: {

    },
    data() {
      return {
        androidRelease: false,
        iOSRelease: false,
        apkUploaded: false,

        postData: {
          name: "",
          releaseType: [],
          size: 0,
          androidUrl: "",
          iOSUrl: "",
          releaseNote: ""
        },

        rules: {
          name: [{
            required: true,
            trigger: "blur",
            message: "版本名称必填"
          }],
          releaseType: [{
            required: true,
            trigger: "blur",
            message: "至少选择一项进行发布"
          }],
          iOSVersionCode: [{
            required: true,
            trigger: "blur",
            message: "iOS版本号必填"
          }],
          androidVersionCode: [{
            required: true,
            trigger: "blur",
            message: "安卓版本号必填"
          }]

        },
        importData: params.default,
      }
    },
    computed: {},
    watch: {
      //   iOSRelease(newValue, lastValue) {
      //     console.log('newValue :>> ', newValue);
      //     console.log('lastValue :>> ', lastValue);
      //   }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      release() {
        this.$refs['dataForm'].validate((valid, err) => {
          if (valid) {

            return;
          }
          //   console.group('release version error');
          //   console.error(err);
          //   console.groupEnd();
        })
      },
      checkFile(file) {
        console.log('file :>> ', file);
        const
          fileName = file.name,
          fileSize = file.size;
        try {
          let versionContent = fileName.replace(/\.apk$/, '').split('_');
          const
            appName = versionContent[0],
            buildType = versionContent[1],
            versionCode = versionContent[2].replace('vc', ''),
            versionName = versionContent[3].replace('vn', '');
          Object.assign(this.postData, {
            name: versionName,
            androidVersionCode: versionCode,
            size: fileSize,
          });
          console.log('appName :>> ', appName, 'buildType :>>', buildType);

        } catch (error) {
          this.$message({
            message: "上传文件名异常，请修正为一下格式：appName_buildType_versionCode_versionName.apk",
            type: "error",
            duration: 5,
          })
          console.error(error);
          return false;
        }
        return true;



      },
      uploaded(response, _, __) {
        console.log('response :>> ', response);
        this.apkUploaded = true;
      }
    },
  }

</script>
<style lang="scss">
  .file-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .file-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 10vh;
    height: 10vh;
    line-height: 10vh;
    text-align: center;
  }

</style>
