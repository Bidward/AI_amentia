<template>
  <div class="bzTree">
    <OrgTree
      :id="domId"
      :data="data"
      :node-render="renderTree"
      :expandAll="true"
      :collapsable="true"
    ></OrgTree>
  </div>
</template>
<script>
import OrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
export default {
  name: 'bzPositionTree',
  components: {
    OrgTree
  },
  props: {
    data: {
      type: Object
    },
    domId: {
      type: String
    }
  },
  methods: {
    renderTree (h, parmars) {
      let showLeader = this.domId === 'positionPic'
      let hasLeader = parmars.head !== '暂无'
      let showhead = showLeader && hasLeader
      return (
        <div class="tree">
          <div class="ico"></div>
          <div class="text">
            <p class="positionName" title={parmars.deptName}>
              {parmars.deptName}
            </p>
            <div class="introduce">
              <span class="leaderName">{showhead ? parmars.head : ''}</span>
              <span class="num" v-show={!showLeader && parmars.approval}>({parmars.approval})</span>
              <span class="num" v-show={showLeader && parmars.incumbency2Total}>({parmars.incumbency2Total})</span>
            </div>
          </div>
        </div>
      )
    }
  }
}
</script>
<style lang="less">
.bzTree {
  .org-tree-container {
    border: 2px dashed #5ec1ad;
  }
  .org-tree-node-label .org-tree-node-label-inner {
    padding: 0px;
    border: 1px solid #5ec1ad;
    box-shadow: none;
    border-radius: 5px;
  }
  .tree {
    width: 170px;
    height: 60px;
    position: relative;
    color: #5ec1ad;
    .ico {
      width: 60px;
      height: 60px;
      position: absolute;
      background-color: #5ec1ad;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAACLlBMVEUAAAAAAAAA//9/f39///9Vqqo/v79/v79mzJlmzMxttrZVv6pbyKNjvKZjx7Fdw6pdw7JcwbFbvKlbwrBcw61hw61bwKhgwK1fwqxewaxewKxewLBgwa1dv6xdw6xcwK1fwa1dv65cwKxdwK5cwaxfvqxfwaxgwKtewKtcv61ewK1fwKxewa1cv6xewKxdv61ewKxcv6tcwa1ewKxdwKtdwa1ewaxdwKxewq5cwKxdwKxewaxdwaxewatdwaxewa1cwKtewq1dwK1dwa1dwKxewaxewa1dwa1dwa1ewKxewaxewKxewaxdwa1ewa1ewaxfwaxev61ewK1dwKxdwKxev6xewK5ewK1ewK1dwK1ewKxewK1dwK1ewaxewa1fwa1kw7BmxLFqxrNrxrRux7VwyLZyybd0yrh1yrl3y7p4y7p5y7t6zLt8zLx8zbx+zb1/zr6Bz7+Cz7+I0cOJ0sOO08WS1ciT1ciU1smX18qc2c2d2c2e2s2g28+l3NGn3dKp3tOs39Wt39Wu4Nav4Nax4dey4diz4ti149m249q55Nu65Ny75dzB59/C5+DG6eLH6uPI6uPK6+TN7ObO7ObQ7efT7ujT7unU7unV7+nV7+rX7+rX8OvY8OvZ8Oza8ezb8e3c8e3c8u3d8u7e8u7j9PHk9fHm9fLm9vLo9vPq9/Tu+Pbv+ffw+fjx+vjz+vn0+/n1+/r3/Pv5/fz7/f38/v38/v79/v7+//7///+UwMspAAAAXnRSTlMAAQECAgMEBAUFBwwOFxceHiEqKi8vNTU7PkFBQkRERUtMTVJTU1NVVlheZmdsb3B/gYGChpCSlJSXmK2ur7GyuLi5vL3Ky9HS1dbY2dra29ze3uTl5ubt8fL1+fr7Hgz4hQAAAg5JREFUGBmFwYlDi3EcBvBvTXQ5cpZIbsUcc5Mj5EjuIzqeTInpcMeKYu4zV1lqrkYWhubo+e/s3db2e3f5fEQvebxx5aaSki2rjRNTJSZD5looNmYnSTQJkw8hTGluokQYWYQodoyWMDmViG626CxCTEtEsRBxLJWgaYgrTwJGVSK+DPFJKIKi6s673vfO7qtQ7DeIZgpUDg7+HfxD2qCYJ16Gw1DU8j40LkJxdISIZELVwFZo3hCq6SJSAFUdbdA4CVWRSDJ06miDxknopMkE6DTwGjQOQidLjNCpZke9xWJpHPBAxySroHeLfpegs04KEea89TFbrRboFctuRDhDRCiXfYjQRDPClctmKO5S4bYiZJesQYiNPZ1dXfaPdNi77J3feA5BG8SIkP6f0DQSPryJIJNMQojrBzQtPAGvk3yEoKmSiiFnv5OuWlS1k7wOXCb5FkPSRQoR4Pnd0sI+tPJecydrwY7mG0TANhHJRgBvAy+J5wRqeNHM40A7AmaKSFIp/PgQ6CaeEjjNC8d4CngBv7IU8cqF32d29/A1rtD1ysMaDPyyfyL88kWTWAyf6mdfvj4xA2197t4moP6Du/8BfA4OE58x+I9xEjAHcS2QoMWIY7koliGmFYmiykMM8yVMxl5EcWCsRDDMPYIwZflJEs3wGVuh2D4rRWJKyzIV7Kyo2LPelJMuOv8AVrT4aK3A2SEAAAAASUVORK5CYII=');
      background-size: cover;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      position: absolute;
      left: 60px;
      width: 110px;
      padding-left: 6px;
      .positionName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        width: 100%;
        margin-top:5px;
      }
      .introduce {
        padding-top: 20px;
        width: 96%;
        text-align: center;
        .leaderName {
          text-align: left;
          display: inline-block;
          width: 50%;
        }
        .num {
          display: inline-block;
          width: 50%;
          text-align: right;
        }
      }
    }
  }
}
</style>
